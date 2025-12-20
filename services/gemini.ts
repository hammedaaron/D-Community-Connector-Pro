
import { GoogleGenAI } from "@google/genai";

export async function suggestFolders(currentFolders: string[]) {
  // Use a fresh instance to ensure the latest API_KEY from process.env is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these existing folders: ${currentFolders.join(', ')}, suggest 3 new relevant social platforms or communities for a "follow-for-follow" app. Return only comma-separated values.`,
    });
    
    // Guidelines: Access .text property directly, do not call as a function.
    const text = response.text;
    return text?.split(',').map(s => s.trim()) || [];
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
}
