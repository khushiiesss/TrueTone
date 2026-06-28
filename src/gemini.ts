import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedColor } from "./types.js";

// Lazy-initialized Gemini client with safety guards as per instructions
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_")) {
      throw new Error("GEMINI_API_KEY is not configured or holds a placeholder value.");
    }

    const isStandardApiKey = apiKey.startsWith("AIzaSy");
    if (isStandardApiKey) {
      console.log("[Gemini API] Initializing with standard API Key (AIzaSy)");
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } else {
      console.log("[Gemini API] Initializing with Authorization Token (AQ.)");
      // Temporarily remove GEMINI_API_KEY from environment to prevent the constructor
      // from picking it up and adding it as an x-goog-api-key query/header
      const originalEnvKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      
      try {
        aiClient = new GoogleGenAI({
          apiKey: undefined,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
              'Authorization': `Bearer ${originalEnvKey}`,
            }
          }
        });
      } finally {
        // Restore environment variable
        process.env.GEMINI_API_KEY = originalEnvKey;
      }
    }
  }
  return aiClient;
}

// Curated high-quality paint presets and brand matches
const PRESET_MOCK_ROOMS: Record<string, { image: string; colors: Omit<ExtractedColor, "id" | "generationId">[] }> = {
  "indian_contemporary": {
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80",
    colors: [
      { hex: "#004B57", rgb: "0, 75, 87", name: "Royal Teal Accent", brandMatch: "Benjamin Moore - Aegean Teal (2136-40)", swatchOrder: 0 },
      { hex: "#E5A93B", rgb: "229, 169, 59", name: "Marigold Ochre", brandMatch: "Sherwin-Williams - Bakelite Gold (SW 6690)", swatchOrder: 1 },
      { hex: "#EBE3CD", rgb: "235, 227, 205", name: "Ivory Tusk", brandMatch: "Sherwin-Williams - Creamy (SW 7012)", swatchOrder: 2 },
      { hex: "#6F4E37", rgb: "111, 78, 55", name: "Spiced Wood Rose", brandMatch: "Benjamin Moore - Cinnamon (2174-20)", swatchOrder: 3 }
    ]
  },
  "western_minimal": {
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80",
    colors: [
      { hex: "#7C9885", rgb: "124, 152, 133", name: "Muted Sage", brandMatch: "Benjamin Moore - Sage Wisdom (CSP-775)", swatchOrder: 0 },
      { hex: "#F3EFE0", rgb: "243, 239, 224", name: "Warm Alabaster", brandMatch: "Sherwin-Williams - Alabaster (SW 7008)", swatchOrder: 1 },
      { hex: "#4A4B4C", rgb: "74, 75, 76", name: "Slate Charcoal", brandMatch: "Sherwin-Williams - Iron Ore (SW 7069)", swatchOrder: 2 }
    ]
  },
  "terracotta": {
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    colors: [
      { hex: "#C97B5A", rgb: "201, 123, 90", name: "Warm Terracotta", brandMatch: "Sherwin-Williams - Cavern Clay (SW 7701)", swatchOrder: 0 },
      { hex: "#F4F1EA", rgb: "244, 241, 234", name: "Pristine Linen", brandMatch: "Benjamin Moore - Simply White (OC-117)", swatchOrder: 1 },
      { hex: "#8E7051", rgb: "142, 112, 81", name: "Toasted Oak", brandMatch: "Sherwin-Williams - Toasty (SW 6081)", swatchOrder: 2 }
    ]
  },
  "scandinavian_cool": {
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=80",
    colors: [
      { hex: "#D2D7DF", rgb: "210, 215, 223", name: "Nordic Mist Blue", brandMatch: "Sherwin-Williams - Upward (SW 6239)", swatchOrder: 0 },
      { hex: "#FFFFFF", rgb: "255, 255, 255", name: "Pure Arctic White", brandMatch: "Benjamin Moore - Chantilly Lace (OC-65)", swatchOrder: 1 },
      { hex: "#5C6F72", rgb: "92, 111, 114", name: "Fjord Gray", brandMatch: "Benjamin Moore - Templeton Gray (HC-161)", swatchOrder: 2 }
    ]
  }
};

/**
 * Perform room wall recoloring via Gemini 2.5 Flash Image.
 * If in TEST_MODE or if no API key is set, returns beautiful high-fidelity mock assets.
 */
export async function recolorRoom(
  sourceImageBase64: string,
  mimeType: string,
  promptText: string,
  stylePreset: string,
  layoutType: string,
  isTestMode = false,
  customColor?: { name: string; hex: string; brandMatch?: string },
  paintFinish?: string,
  lighting?: string
): Promise<{ resultImageUrl: string; colors: Omit<ExtractedColor, "id" | "generationId">[] }> {
  
  const presetKey = PRESET_MOCK_ROOMS[stylePreset] ? stylePreset : "terracotta";
  const presetData = PRESET_MOCK_ROOMS[presetKey];

  if (isTestMode) {
    console.log(`[TEST_MODE] Mocking recoloring for preset: ${stylePreset}, layout: ${layoutType}`);
    // If they picked a custom color in testMode, we return the mockup room with the active colors
    const activeColors = customColor ? [
      { hex: customColor.hex, rgb: "120, 120, 120", name: customColor.name, brandMatch: customColor.brandMatch || "Custom Match", swatchOrder: 0 },
      ...presetData.colors.slice(1)
    ] : presetData.colors;

    return {
      resultImageUrl: presetData.image,
      colors: activeColors
    };
  }

  try {
    const client = getGeminiClient();

    // 1. Prepare dynamic mapping for stylePreset or custom selected color
    let targetColorName = presetData.colors[0].name;
    let targetHex = presetData.colors[0].hex;
    let targetBrand = presetData.colors[0].brandMatch;

    if (customColor) {
      targetColorName = customColor.name;
      targetHex = customColor.hex;
      targetBrand = customColor.brandMatch || "Custom Selected Swatch";
    }

    let fullPrompt = `CRITICAL DIRECTIVE: You MUST analyze and use the uploaded source image as the absolute foundation for this edit. Do NOT generate a generic or default room.
You are a professional, hyper-realistic architectural and interior design rendering engine.
Your task is to take the provided user-uploaded image of this exact room and repaint ONLY the wall surfaces to the exact shade "${targetColorName}" with HEX code "${targetHex}" (swatch match: ${targetBrand}).
Keep everything else in the image EXACTLY identical to the user's uploaded image: the same furniture, layout, decor, flooring, windows, doors, curtains, lighting sources, ceiling, camera angle, perspective, framing, and aspect ratio.
Only paint the wall surfaces. Preserve the textures, light directions, gradients, shadows, and reflections on the walls perfectly to ensure realistic finishes.
${paintFinish ? `Apply a ${paintFinish.replace('_', ' ')} finish to the paint.` : ''}
${lighting ? `Ensure the lighting reflects a ${lighting.replace('_', ' ')} atmosphere while keeping the original light sources intact.` : ''}
Extra user-provided instructions: "${promptText}".
Apply the changes directly to the uploaded room image and return the resulting recolored image.`;

    // 2. Call gemini-2.5-flash-image for image editing
    let base64Data = sourceImageBase64;
    if (sourceImageBase64.startsWith("http://") || sourceImageBase64.startsWith("https://")) {
      try {
        console.log(`[Gemini API] Fetching remote image URL: ${sourceImageBase64}`);
        const fetchRes = await fetch(sourceImageBase64);
        if (fetchRes.ok) {
          const arrayBuffer = await fetchRes.arrayBuffer();
          base64Data = Buffer.from(arrayBuffer).toString("base64");
        } else {
          console.warn(`[Gemini API] Failed to fetch remote image, status: ${fetchRes.status}`);
        }
      } catch (err: any) {
        console.error("[Gemini API] Error fetching remote image URL:", err.message);
      }
    }
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
    
    console.log(`[Gemini API] Dispatching image recolor to gemini-2.5-flash-image...`);
    const imgResponse = await client.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType || "image/jpeg"
          }
        },
        {
          text: fullPrompt
        }
      ],
      config: {
        responseModalities: ["IMAGE"]
      }
    });

    let resultImageUrl: string | null = null;
    const candidates = imgResponse.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          resultImageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultImageUrl) {
      console.warn("Gemini 2.5 Flash Image did not return raw inline image data.");
      throw new Error("The Gemini API was contacted successfully, but the image generation model did not return any image data back in its response candidates. Please try again with a different image or format.");
    }

    // 3. Extract colors via gemini-3.5-flash
    let extractedColors: Omit<ExtractedColor, "id" | "generationId">[] = [];
    try {
      console.log(`[Gemini API] Dispatching color analysis to gemini-3.5-flash...`);
      const paletteResponse = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Analyze this design prompt and preset style choice: "${stylePreset}". Target base color picked by user: "${targetColorName}" (${targetHex}, ${targetBrand}).
Generate a harmonized paint color palette of 3 to 4 professional interior paint colors that perfectly match or complement this aesthetic, featuring the user's picked color as the primary anchor.
Each color must contain:
1. HEX code (e.g. "#C97B5A")
2. RGB string values (e.g. "201, 123, 90")
3. Human-friendly paint color name (e.g. "Desert Terracotta")
4. The nearest professional paint-brand match (e.g. "Sherwin-Williams - Cavern Clay SW 7701")
5. An ordering integer starting at 0.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hex: { type: Type.STRING, description: "HEX value starting with #" },
                rgb: { type: Type.STRING, description: "RGB string, format: R, G, B" },
                name: { type: Type.STRING, description: "Aesthetic color name" },
                brandMatch: { type: Type.STRING, description: "Manufacturer and paint swatch code" },
                swatchOrder: { type: Type.INTEGER }
              },
              required: ["hex", "rgb", "name", "brandMatch", "swatchOrder"]
            }
          }
        }
      });

      if (paletteResponse.text) {
        extractedColors = JSON.parse(paletteResponse.text.trim());
      }
    } catch (paletteError) {
      console.error("Failed to extract color palette using Gemini. Falling back to pre-defined presets.", paletteError);
      extractedColors = presetData.colors;
    }

    if (extractedColors.length === 0) {
      extractedColors = presetData.colors;
    }

    return {
      resultImageUrl,
      colors: extractedColors
    };

  } catch (error: any) {
    console.error("Gemini API direct recolor failed:", error.message || error);
    throw error;
  }
}
