
import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysis } from "../types";

export const analyzeSkin = async (base64Image: string): Promise<SkinAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Extract base64 data from the data URI
  const base64Data = base64Image.split(',')[1];
  
  const prompt = `Analyze this facial image for skin health. Your goal is to help a regular person understand their skin state and decide if they need a professional facial.
  
  SCORING SYSTEM (1-10):
  - 10: Perfect skin. Healthy, hydrated, and clear.
  - 1: Skin that really needs help. Very clogged, very dry, or very irritated.
  
  Look for signs of:
  1. Clogged pores or blackheads
  2. Dryness (skin looking "thirsty" or having tiny flakes)
  3. Tired skin (lacking a healthy glow)
  4. Redness or sensitivity
  5. Roughness or small bumps
  
  LANGUAGE GUIDELINES:
  - Use very simple, everyday language.
  - DO NOT use acronyms like TLC. Use "extra care" or "attention" instead.
  - DO NOT use medical jargon. Use "clogged" instead of "congested," "redness" instead of "erythema."
  - Be encouraging and helpful.
  
  Provide a detailed analysis in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shouldGetFacial: { type: Type.BOOLEAN },
            urgencyScore: { type: Type.INTEGER, description: "1-10 score: 10 is perfect, 1 is high need for help" },
            skinConcerns: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Visible skin issues described in very simple, plain English"
            },
            reasoning: { type: Type.STRING, description: "A clear, simple explanation of what you see" },
            recommendedTreatment: { type: Type.STRING, description: "A simple name for the treatment (e.g., 'Deep Clean' or 'Moisture Boost')" },
            homeCareTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Simple, easy steps for home care"
            }
          },
          required: ["shouldGetFacial", "urgencyScore", "skinConcerns", "reasoning", "recommendedTreatment", "homeCareTips"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No analysis returned from AI");
    
    return JSON.parse(resultText) as SkinAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
