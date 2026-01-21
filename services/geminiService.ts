
import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysis } from "../types";

export const analyzeSkin = async (base64Image: string): Promise<SkinAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Extract base64 data from the data URI
  const base64Data = base64Image.split(',')[1];
  
  const prompt = `Analyze this facial image for skin health. Your goal is to help a regular person understand their skin state and decide if they need a professional facial.
  
  Look for signs of:
  1. Congestion (clogged pores, blackheads)
  2. Dehydration (dryness, tight-looking skin, fine lines)
  3. Dullness (skin looking "tired" or lacking its natural glow)
  4. Redness or sensitivity
  5. Texture (roughness or bumps)
  
  IMPORTANT LANGUAGE GUIDELINE:
  - Avoid heavy medical jargon. Instead of "erythema," say "visible redness." Instead of "desquamation," say "flaking or peeling skin."
  - If you must use a technical term, explain it simply.
  - Keep the tone like a friendly, knowledgeable skin consultant.
  
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
            urgencyScore: { type: Type.INTEGER, description: "1-10 score of how much the skin needs professional attention" },
            skinConcerns: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Visible skin issues described in simple, plain English"
            },
            reasoning: { type: Type.STRING, description: "A clear, easy-to-read explanation of what you see in the photo" },
            recommendedTreatment: { type: Type.STRING, description: "A simple name for the suggested treatment (e.g., 'Deep Clean' or 'Moisture Boost')" },
            homeCareTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Simple, actionable advice for home maintenance"
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
