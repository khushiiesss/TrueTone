import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db.js";
import { recolorRoom } from "./src/gemini.js";
import { CreditReason, SubscriptionPlan } from "./src/types.js";
import Stripe from "stripe";

let stripeClient: Stripe | null = null;
const getStripe = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2023-10-16" as any,
    });
  }
  return stripeClient;
};

const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // support larger payloads for high resolution room photos
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Dynamic tenant-isolated user context resolver middleware
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    let userId = "user_yash"; // default fallback for local/backward compatibility
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      if (token && token !== "null" && token !== "undefined") {
        userId = token;
      }
    }
    (req as any).userId = userId;
    next();
  });

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Get current user, profile, subscription and credit wallet
  app.get("/api/auth/me", (req, res) => {
    try {
      const userId = (req as any).userId;
      const profile = db.getProfile(userId);
      const subscription = db.getSubscription(userId);
      const wallet = db.getWallet(userId);
      res.json({
        userId,
        email: userId.startsWith("google_") ? `${userId.substring(7)}@gmail.com` : `${userId}@truetone.ai`,
        profile,
        subscription,
        wallet
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Projects list
  app.get("/api/projects", (req, res) => {
    try {
      const userId = (req as any).userId;
      const projects = db.getProjects(userId);
      res.json(projects);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Single project details
  app.get("/api/projects/:id", (req, res) => {
    try {
      const userId = (req as any).userId;
      const proj = db.getProject(req.params.id);
      if (!proj || proj.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(proj);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Create project
  app.post("/api/projects", (req, res) => {
    try {
      const userId = (req as any).userId;
      const { title, description } = req.body;
      if (!title) return res.status(400).json({ error: "Title is required" });
      const proj = db.createProject(userId, title, description || "");
      res.status(201).json(proj);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Update project
  app.put("/api/projects/:id", (req, res) => {
    try {
      const userId = (req as any).userId;
      const { title, description, coverImageUrl } = req.body;
      const proj = db.getProject(req.params.id);
      if (!proj || proj.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const updated = db.updateProject(req.params.id, { title, description, coverImageUrl });
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", (req, res) => {
    try {
      const userId = (req as any).userId;
      const proj = db.getProject(req.params.id);
      if (!proj || proj.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      db.deleteProject(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Immediate upload and persist source image endpoint (survives reload before generation)
  app.post("/api/projects/:id/upload", (req, res) => {
    try {
      const userId = (req as any).userId;
      const projectId = req.params.id;
      const proj = db.getProject(projectId);
      if (!proj || proj.userId !== userId) {
        return res.status(404).json({ error: "Project not found or unauthorized" });
      }
      
      const { sourceImageBase64, mimeType } = req.body;
      if (!sourceImageBase64) {
        return res.status(400).json({ error: "No image content provided" });
      }
      
      const srcImg = db.addSourceImage(projectId, sourceImageBase64, mimeType || "image/jpeg");
      db.updateProject(projectId, {
        coverImageUrl: sourceImageBase64
      });
      
      res.json({ success: true, sourceImage: srcImg });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get project generations
  app.get("/api/projects/:id/generations", (req, res) => {
    try {
      const userId = (req as any).userId;
      const proj = db.getProject(req.params.id);
      if (!proj || proj.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }
      const generations = db.getGenerations(req.params.id);
      
      // Load color palettes for each generation
      const generationsWithColors = generations.map(gen => {
        const colors = db.getExtractedColors(gen.id);
        return {
          ...gen,
          colors
        };
      });

      res.json(generationsWithColors);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Generate paint visualization
  app.post("/api/projects/:id/generate", async (req, res) => {
    try {
      const userId = (req as any).userId;
      const projectId = req.params.id;
      const proj = db.getProject(projectId);
      if (!proj || proj.userId !== userId) {
        return res.status(404).json({ error: "Project not found" });
      }

      const { sourceImageBase64, mimeType, promptText, stylePreset, layoutType, imageCount = 1 } = req.body;

      if (!sourceImageBase64) {
        return res.status(400).json({ error: "Room photo is required." });
      }

      // 1. Calculate credit cost
      let multiplier = 1.0;
      if (layoutType === "two_tone") multiplier = 1.2;
      if (layoutType === "comparison") multiplier = 1.5;
      const cost = Math.ceil(imageCount * multiplier);

      // 2. Check and deduct credits atomically
      const successDeduct = db.deductCredits(userId, cost, "generation", projectId);
      if (!successDeduct) {
        return res.status(402).json({
          error: "Insufficient credits.",
          required: cost,
          balance: db.getWallet(userId).balance
        });
      }

      // 3. Add Source Image if not exists or if new
      const srcImg = db.addSourceImage(projectId, sourceImageBase64, mimeType || "image/jpeg");

      // 4. Run recoloring
      const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
      const isTestMode = !hasApiKey || req.body.testMode === true;

      console.log(`Starting recoloring. Mode: ${isTestMode ? "SIMULATED" : "GEMINI_AI"}`);
      const recolorResult = await recolorRoom(
        sourceImageBase64,
        mimeType || "image/jpeg",
        promptText || "",
        stylePreset || "terracotta",
        layoutType || "full_wall",
        isTestMode
      );

      // 5. Save generation details
      const generation = db.createGeneration(
        projectId,
        srcImg.id,
        promptText || "",
        stylePreset || "terracotta",
        layoutType || "full_wall",
        cost
      );

      // Update generation status and outputs
      db.update((schema) => {
        const gen = schema.generations[generation.id];
        if (gen) {
          gen.status = "done";
          gen.resultImageUrls = [recolorResult.resultImageUrl];
          gen.meta = {
            geminiRequestId: `req_${Math.random().toString(36).substr(2, 9)}`,
            paletteUsed: recolorResult.colors.map(c => c.hex),
            timings: { start: Date.now() - 2000, end: Date.now() }
          };
        }
      });

      // 6. Save extracted colors
      db.addExtractedColors(generation.id, recolorResult.colors);

      // 7. Update project cover
      db.updateProject(projectId, {
        coverImageUrl: recolorResult.resultImageUrl,
        lastGeneratedAt: new Date().toISOString()
      });

      const finalGen = {
        ...db.getRaw().generations[generation.id],
        colors: db.getExtractedColors(generation.id)
      };

      res.status(201).json(finalGen);

    } catch (e: any) {
      console.error("Generation error:", e);
      res.status(500).json({ error: e.message || "An unexpected error occurred during recoloring." });
    }
  });

  // Credit top-up and subscriptions (Stripe simulators)
  app.get("/api/wallet", (req, res) => {
    const userId = (req as any).userId;
    res.json(db.getWallet(userId));
  });

  app.get("/api/wallet/ledger", (req, res) => {
    const userId = (req as any).userId;
    const ledger = db.getRaw().creditLedger.filter(l => l.userId === userId);
    res.json(ledger);
  });

  // Simulate checkout sessions or topup events (Stripe sync simulator)
  app.post("/api/stripe/checkout", async (req, res) => {
    try {
      const userId = (req as any).userId;
      const { type, plan, packId } = req.body;
      const stripe = getStripe();

      if (stripe) {
        let lineItemName = "";
        let priceInCents = 0;

        if (type === "subscription") {
          const plansInfo: Record<string, { price: number; credits: number }> = {
            early_bird: { price: 900, credits: 150 },
            pro: { price: 2900, credits: 600 },
            custom: { price: 9900, credits: 2500 }
          };
          const pInfo = plansInfo[plan] || plansInfo.early_bird;
          lineItemName = `TrueTone AI - ${plan} subscription`;
          priceInCents = pInfo.price;
        } else {
          const packsInfo: Record<string, { credits: number; price: number }> = {
            pack_100: { credits: 100, price: 900 },
            pack_300: { credits: 300, price: 2400 },
            pack_1000: { credits: 1000, price: 6900 }
          };
          const pInfo = packsInfo[packId] || packsInfo.pack_100;
          lineItemName = `TrueTone AI - Credit Pack (${packId})`;
          priceInCents = pInfo.price;
        }

        const appUrl = process.env.APP_URL || `http://localhost:3000`;
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: lineItemName,
                },
                unit_amount: priceInCents,
              },
              quantity: 1,
            }
          ],
          mode: "payment",
          success_url: `${appUrl}/api/stripe/callback?session_id={CHECKOUT_SESSION_ID}&userId=${userId}&type=${type}&plan=${plan || ''}&packId=${packId || ''}`,
          cancel_url: `${appUrl}/?payment=cancel`,
        });

        res.json({ url: session.url });
      } else {
        if (type === "subscription") {
          const plansInfo: Record<string, { price: number; credits: number; retention: number }> = {
            early_bird: { price: 9, credits: 150, retention: 30 },
            pro: { price: 29, credits: 600, retention: 90 },
            custom: { price: 99, credits: 2500, retention: 0 }
          };
          const pInfo = plansInfo[plan] || plansInfo.early_bird;

          db.update((schema) => {
            const sub = schema.subscriptions[userId];
            if (sub) {
              sub.plan = plan as SubscriptionPlan;
              sub.status = "active";
              sub.currentPeriodEnd = getFutureDate(30);
              sub.historyRetentionDays = pInfo.retention;
            }
          });

          db.grantCredits(userId, pInfo.credits, "subscription_grant", `sub_${plan}`);

          res.json({
            success: true,
            message: `Successfully simulated Early Bird/Pro recurring checkout! Granted ${pInfo.credits} credits.`,
            subscription: db.getSubscription(userId),
            wallet: db.getWallet(userId)
          });
        } else {
          // topup pack
          const packsInfo: Record<string, { credits: number; price: number }> = {
            pack_100: { credits: 100, price: 9 },
            pack_300: { credits: 300, price: 24 },
            pack_1000: { credits: 1000, price: 69 }
          };
          const pInfo = packsInfo[packId] || packsInfo.pack_100;

          db.grantCredits(userId, pInfo.credits, "topup", packId);

          res.json({
            success: true,
            message: `Successfully simulated Stripe checkout! Added ${pInfo.credits} credits to wallet.`,
            wallet: db.getWallet(userId)
          });
        }
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Real Stripe Callback endpoint
  app.get("/api/stripe/callback", async (req, res) => {
    try {
      const { session_id, userId, type, plan, packId } = req.query as any;
      const stripe = getStripe();

      if (stripe && session_id) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status === "paid") {
          if (type === "subscription") {
            const plansInfo: Record<string, { price: number; credits: number; retention: number }> = {
              early_bird: { price: 9, credits: 150, retention: 30 },
              pro: { price: 29, credits: 600, retention: 90 },
              custom: { price: 99, credits: 2500, retention: 0 }
            };
            const pInfo = plansInfo[plan] || plansInfo.early_bird;

            db.update((schema) => {
              const sub = schema.subscriptions[userId];
              if (sub) {
                sub.plan = plan as SubscriptionPlan;
                sub.status = "active";
                sub.currentPeriodEnd = getFutureDate(30);
                sub.historyRetentionDays = pInfo.retention;
              }
            });

            db.grantCredits(userId, pInfo.credits, "subscription_grant", `sub_${plan}`);
          } else {
            const packsInfo: Record<string, { credits: number; price: number }> = {
              pack_100: { credits: 100, price: 9 },
              pack_300: { credits: 300, price: 24 },
              pack_1000: { credits: 1000, price: 69 }
            };
            const pInfo = packsInfo[packId] || packsInfo.pack_100;

            db.grantCredits(userId, pInfo.credits, "topup", packId);
          }
        }
      }

      res.redirect("/#payment=success");
    } catch (e: any) {
      console.error("Stripe callback error:", e);
      res.redirect("/#payment=error");
    }
  });

  // Save profile settings
  app.post("/api/profile", (req, res) => {
    try {
      const userId = (req as any).userId;
      const { fullName, theme, notifEmail, notifProduct, onboardingCompleted } = req.body;
      db.update((schema) => {
        const p = schema.profiles[userId];
        if (p) {
          if (fullName) p.fullName = fullName;
          if (theme) p.theme = theme;
          if (notifEmail !== undefined) p.notifEmail = notifEmail;
          if (notifProduct !== undefined) p.notifProduct = notifProduct;
          if (onboardingCompleted !== undefined) p.onboardingCompleted = onboardingCompleted;
        }
      });
      res.json(db.getProfile(userId));
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Contact form submission
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required." });
      }
      console.log(`[CONTACT SUBMISSION] Name: ${name}, Email: ${email}, Subject: ${subject}, Msg: ${message}`);
      res.json({ success: true, message: "We have received your message. We'll get back to you within 24 hours!" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Delete all photos and export data controls (Privacy spec)
  app.post("/api/privacy/delete-all-photos", (req, res) => {
    try {
      const userId = (req as any).userId;
      const userProjects = db.getProjects(userId);
      const userProjIds = userProjects.map(p => p.id);
      
      db.update((schema) => {
        // Delete only this user's source images and empty their generation outputs
        Object.keys(schema.sourceImages).forEach(k => {
          if (userProjIds.includes(schema.sourceImages[k].projectId)) {
            delete schema.sourceImages[k];
          }
        });
        Object.keys(schema.generations).forEach(k => {
          if (userProjIds.includes(schema.generations[k].projectId)) {
            schema.generations[k].resultImageUrls = [];
          }
        });
        userProjects.forEach(proj => {
          if (schema.projects[proj.id]) {
            schema.projects[proj.id].coverImageUrl = undefined;
          }
        });
      });
      res.json({ success: true, message: "All home and room photos deleted completely from secure storage." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/privacy/export", (req, res) => {
    try {
      const userId = (req as any).userId;
      const allData = {
        profile: db.getProfile(userId),
        subscription: db.getSubscription(userId),
        wallet: db.getWallet(userId),
        projects: db.getProjects(userId),
        ledger: db.getRaw().creditLedger.filter(l => l.userId === userId)
      };
      res.json(allData);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Vite Dev Server Middleware or Static Build Handlers ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TrueTone AI Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
