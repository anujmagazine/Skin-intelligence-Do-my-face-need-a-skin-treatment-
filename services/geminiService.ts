
import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysis } from "../types";

export const analyzeSkin = async (base64Image: string): Promise<SkinAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Extract base64 data from the data URI
  const base64Data = base64Image.split(',')[1];
  
  const prompt = `You are an expert, high-end esthetician who speaks with warmth, grace, and empathy. Analyze this facial image to help the user understand their skin's current mood.
  
  TONE & STYLE:
  - Use "Soft Feminine Self-Care" language. Think of a luxury spa consultation.
  - Avoid clinical or medical words like "pathology," "epidermis," "congestion," or "clinical findings."
  - Instead of "Scan," use words like "Observation" or "Ritual."
  - Instead of "Urgency," think of "Care Priority."
  - Be encouraging, gentle, and focused on nurturing the skin.
  
  SCORING SYSTEM (1-10):
  - 10: Radiant, balanced, and deeply hydrated.
  - 1: Very tired, thirsty, or in need of immediate professional nurturing.
  
  Provide a detailed consultation in JSON format.`;

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
            urgencyScore: { type: Type.INTEGER, description: "1-10 score: 10 is radiant perfection, 1 is skin needing deep care" },
            skinConcerns: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Skin observations described with warmth (e.g., 'your skin is feeling a bit thirsty' instead of 'dehydrated')"
            },
            reasoning: { type: Type.STRING, description: "A gentle, nurturing explanation of what you observe in her radiance" },
            recommendedTreatment: { type: Type.STRING, description: "An elegant name for a spa treatment (e.g., 'The Dewy Glow Ritual')" },
            homeCareTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Nurturing self-care steps for her morning or evening ritual"
            }
          },
          required: ["shouldGetFacial", "urgencyScore", "skinConcerns", "reasoning", "recommendedTreatment", "homeCareTips"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No consultation returned from the AI");
    
    return JSON.parse(resultText) as SkinAnalysis;
  } catch (error) {
    console.error("Esthetician Consultation Error:", error);
    throw error;
  }
};
