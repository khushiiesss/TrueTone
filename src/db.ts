import fs from 'fs';
import path from 'path';
import { DatabaseSchema, Profile, Subscription, CreditWallet, Project, SourceImage, Generation, ExtractedColor, CreditReason } from './types.js';

const DB_FILE = path.join(process.cwd(), 'db.json');

// Helper to get relative date
const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

const INITIAL_DB: DatabaseSchema = {
  profiles: {
    "user_yash": {
      id: "user_yash",
      fullName: "Yash Raghuvanshi",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      theme: "light",
      notifEmail: true,
      notifProduct: true,
      onboardingCompleted: true
    }
  },
  subscriptions: {
    "user_yash": {
      userId: "user_yash",
      plan: "early_bird",
      status: "active",
      currentPeriodEnd: getFutureDate(30),
      historyRetentionDays: 30
    }
  },
  creditWallets: {
    "user_yash": {
      userId: "user_yash",
      balance: 150,
      lifetimePurchased: 150,
      lifetimeSpent: 0
    }
  },
  creditLedger: [
    {
      id: "ledger_init",
      userId: "user_yash",
      delta: 150,
      reason: "signup_bonus",
      balanceAfter: 150,
      createdAt: new Date().toISOString()
    }
  ],
  projects: {
    "proj_1": {
      id: "proj_1",
      userId: "user_yash",
      title: "Cozy Living Room Accent",
      description: "Testing out terracotta and warm tones on the main media wall.",
      coverImageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    "proj_2": {
      id: "proj_2",
      userId: "user_yash",
      title: "Minimalist Master Bedroom",
      description: "Comparing sage green and slate gray behind the headboard.",
      coverImageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&auto=format&fit=crop&q=80",
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  },
  sourceImages: {
    "src_1": {
      id: "src_1",
      projectId: "proj_1",
      storagePath: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80",
      mime: "image/jpeg",
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    "src_2": {
      id: "src_2",
      projectId: "proj_2",
      storagePath: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80",
      mime: "image/jpeg",
      createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    }
  },
  generations: {
    "gen_1": {
      id: "gen_1",
      projectId: "proj_1",
      sourceImageId: "src_1",
      promptText: "paint the background wall a beautiful warm terracotta",
      stylePreset: "terracotta",
      layoutType: "accent_wall",
      status: "done",
      resultImageUrls: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"],
      creditsCost: 1,
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  },
  extractedColors: [
    {
      id: "color_1",
      generationId: "gen_1",
      hex: "#C97B5A",
      rgb: "201, 123, 90",
      name: "Warm Terracotta",
      brandMatch: "Sherwin-Williams - Cavern Clay (SW 7701)",
      swatchOrder: 0
    },
    {
      id: "color_2",
      generationId: "gen_1",
      hex: "#F4F1EA",
      rgb: "244, 241, 234",
      name: "Alabaster White",
      brandMatch: "Sherwin-Williams - Alabaster (SW 7008)",
      swatchOrder: 1
    }
  ],
  usageEvents: []
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = { ...INITIAL_DB };
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(content);
      } else {
        this.save();
      }
    } catch (e) {
      console.error("Error loading db.json, using fallback", e);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error saving db.json", e);
    }
  }

  // Transaction-like helper
  public update(fn: (db: DatabaseSchema) => void) {
    fn(this.data);
    this.save();
  }

  public getRaw(): DatabaseSchema {
    return this.data;
  }

  // Profile operations
  public getProfile(userId: string): Profile {
    if (!this.data.profiles[userId]) {
      // create lazy profile
      this.data.profiles[userId] = {
        id: userId,
        fullName: userId === 'user_yash' ? 'Yash Raghuvanshi' : 'Guest User',
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`,
        theme: 'light',
        notifEmail: true,
        notifProduct: true,
        onboardingCompleted: false
      };
      this.save();
    }
    return this.data.profiles[userId];
  }

  // Subscription operations
  public getSubscription(userId: string): Subscription {
    if (!this.data.subscriptions[userId]) {
      this.data.subscriptions[userId] = {
        userId,
        plan: 'trial',
        status: 'trialing',
        currentPeriodEnd: getFutureDate(7),
        historyRetentionDays: 7
      };
      this.save();
    }
    return this.data.subscriptions[userId];
  }

  // Wallet operations
  public getWallet(userId: string): CreditWallet {
    if (!this.data.creditWallets[userId]) {
      this.data.creditWallets[userId] = {
        userId,
        balance: 20, // Free trial credits
        lifetimePurchased: 20,
        lifetimeSpent: 0
      };
      // Ledger entry for signup bonus
      this.data.creditLedger.push({
        id: `ledger_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        delta: 20,
        reason: 'signup_bonus',
        balanceAfter: 20,
        createdAt: new Date().toISOString()
      });
      this.save();
    }
    return this.data.creditWallets[userId];
  }

  // Deduct credits atomically
  public deductCredits(userId: string, amount: number, reason: CreditReason, refId?: string): boolean {
    const wallet = this.getWallet(userId);
    if (wallet.balance < amount) {
      return false;
    }

    wallet.balance -= amount;
    wallet.lifetimeSpent += amount;

    this.data.creditLedger.push({
      id: `ledger_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      delta: -amount,
      reason,
      refId,
      balanceAfter: wallet.balance,
      createdAt: new Date().toISOString()
    });

    this.save();
    return true;
  }

  // Grant credits (e.g. subscription or top-up)
  public grantCredits(userId: string, amount: number, reason: CreditReason, refId?: string) {
    const wallet = this.getWallet(userId);
    wallet.balance += amount;
    wallet.lifetimePurchased += amount;

    this.data.creditLedger.push({
      id: `ledger_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      delta: amount,
      reason,
      refId,
      balanceAfter: wallet.balance,
      createdAt: new Date().toISOString()
    });

    this.save();
  }

  // Projects
  public getProjects(userId: string): Project[] {
    return Object.values(this.data.projects).filter(p => p.userId === userId);
  }

  public getProject(projectId: string): Project | undefined {
    return this.data.projects[projectId];
  }

  public createProject(userId: string, title: string, description: string): Project {
    const id = `proj_${Math.random().toString(36).substr(2, 9)}`;
    const newProj: Project = {
      id,
      userId,
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects[id] = newProj;
    this.save();
    return newProj;
  }

  public updateProject(projectId: string, updates: Partial<Project>): Project | undefined {
    const proj = this.data.projects[projectId];
    if (!proj) return undefined;
    const updated = { ...proj, ...updates, updatedAt: new Date().toISOString() };
    this.data.projects[projectId] = updated;
    this.save();
    return updated;
  }

  public deleteProject(projectId: string) {
    delete this.data.projects[projectId];
    // cascade source images
    const sourceImageIds = Object.keys(this.data.sourceImages).filter(k => this.data.sourceImages[k].projectId === projectId);
    sourceImageIds.forEach(id => {
      delete this.data.sourceImages[id];
    });
    // cascade generations
    const generationIds = Object.keys(this.data.generations).filter(k => this.data.generations[k].projectId === projectId);
    generationIds.forEach(id => {
      delete this.data.generations[id];
      // cascade extracted colors
      this.data.extractedColors = this.data.extractedColors.filter(c => c.generationId !== id);
    });
    this.save();
  }

  // Source Images
  public getSourceImages(projectId: string): SourceImage[] {
    return Object.values(this.data.sourceImages).filter(img => img.projectId === projectId);
  }

  public addSourceImage(projectId: string, storagePath: string, mime: string): SourceImage {
    const id = `src_${Math.random().toString(36).substr(2, 9)}`;
    const newImg: SourceImage = {
      id,
      projectId,
      storagePath,
      mime,
      createdAt: new Date().toISOString()
    };
    this.data.sourceImages[id] = newImg;
    this.save();
    return newImg;
  }

  // Generations
  public getGenerations(projectId: string): Generation[] {
    return Object.values(this.data.generations).filter(gen => gen.projectId === projectId);
  }

  public createGeneration(projectId: string, sourceImageId: string, promptText: string, stylePreset: string, layoutType: string, creditsCost: number): Generation {
    const id = `gen_${Math.random().toString(36).substr(2, 9)}`;
    const newGen: Generation = {
      id,
      projectId,
      sourceImageId,
      promptText,
      stylePreset,
      layoutType,
      status: 'queued',
      resultImageUrls: [],
      creditsCost,
      createdAt: new Date().toISOString()
    };
    this.data.generations[id] = newGen;
    this.save();
    return newGen;
  }

  public addExtractedColors(generationId: string, colors: Omit<ExtractedColor, 'id' | 'generationId'>[]) {
    colors.forEach(c => {
      this.data.extractedColors.push({
        id: `color_${Math.random().toString(36).substr(2, 9)}`,
        generationId,
        ...c
      });
    });
    this.save();
  }

  public getExtractedColors(generationId: string): ExtractedColor[] {
    return this.data.extractedColors.filter(c => c.generationId === generationId);
  }
}

export const db = new Database();
