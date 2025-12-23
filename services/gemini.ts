import { GoogleGenAI } from "@google/genai";

// Fix: Initializing GoogleGenAI with process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceDiaryEntry = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Transform the following diary entry into a super cute, aesthetic, "kawaii" version suitable for a My Melody themed app. Keep the original meaning but add cute emoji and a soft, friendly tone: "${text}"`,
      config: {
        temperature: 0.8,
        // Removed maxOutputTokens to avoid reaching token limits unexpectedly without a thinking budget.
      }
    });
    // Fix: Accessing .text property directly as it is a getter.
    return response.text || text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text;
  }
};