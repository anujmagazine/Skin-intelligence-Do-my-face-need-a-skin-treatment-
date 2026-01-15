
import { GoogleGenAI, Type } from "@google/genai";
import { SkinAnalysis } from "../types";

export const analyzeSkin = async (base64Image: string): Promise<SkinAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  // Extract base64 data from the data URI
  const base64Data = base64Image.split(',')[1];
  
  const prompt = `Analyze this facial image for skin health. Determine if the person would benefit from a professional facial treatment.
  Look for signs of:
  1. Congestion/blackheads/clogged pores
  2. Dehydration or flakiness
  3. Dullness or uneven tone
  4. Redness or inflammation
  5. Texture issues
  
  Provide a detailed analysis in JSON format. Be professional, encouraging, and clinical in tone.`;

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
              description: "Identified visible skin issues"
            },
            reasoning: { type: Type.STRING, description: "Detailed explanation of the findings" },
            recommendedTreatment: { type: Type.STRING, description: "Type of facial suggested (e.g., Hydrating, Deep Cleansing, Chemical Peel)" },
            homeCareTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable advice for home maintenance"
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
