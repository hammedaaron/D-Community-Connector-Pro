
import { GoogleGenAI } from "@google/genai";

export async function suggestFolders(currentFolders: string[]) {
  // Safe retrieval of the API key
  const apiKey = (window as any).process?.env?.API_KEY || "";
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Suggestions disabled.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these existing folders: ${currentFolders.join(', ')}, suggest 3 new relevant social platforms or communities for a "follow-for-follow" app. Return only comma-separated values.`,
    });
    
    const text = response.text;
    return text?.split(',').map(s => s.trim()) || [];
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
}
