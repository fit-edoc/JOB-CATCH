import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not set in server/.env. AI features will fail until it is provided.");
  }
  return new GoogleGenerativeAI(apiKey || "MOCK_KEY");
};

/**
 * Generates content using Gemini LLM
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
export const generateContent = async (prompt) => {
  try {
    const genAI = getGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

/**
 * Helper to generate JSON response from Gemini
 * @param {string} prompt 
 * @returns {Promise<any>}
 */
export const generateJSON = async (prompt) => {
  try {
    const genAI = getGeminiAI();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("Gemini JSON Generation Error:", error);
    // Fallback parsing attempt in case Gemini didn't format perfectly
    try {
      const text = await generateContent(prompt);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (fallbackError) {
      console.error("Fallback JSON parsing failed:", fallbackError);
    }
    throw new Error(`AI JSON Generation Error: ${error.message}`);
  }
};
