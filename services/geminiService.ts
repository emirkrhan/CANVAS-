import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from "../types";

// Helper to get the correct API key source
// For standard calls (Chat, Edit), we use the env key.
// For Veo/Pro-Image (Generation), we might need the window.aistudio key (handled in component usually, but we can structure here).

export const getAIClient = (customKey?: string) => {
  return new GoogleGenAI({ apiKey: customKey || process.env.API_KEY });
};

// --- Chat Service ---
export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      history: history,
      config: {
        systemInstruction: "You are a helpful AI assistant for Abstracto.ai, a graphical abstract generation tool. You help scientists and researchers design beautiful visuals for their papers. Keep answers concise and helpful.",
      }
    });

    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

// --- Text Polish Service (Magic Edit) ---
export const polishText = async (
  originalText: string,
  instruction: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Original Text: "${originalText}"
      
      Instruction: ${instruction}
      
      Return only the improved text. Do not include quotes or explanations.`,
    });
    return response.text || originalText;
  } catch (error) {
    console.error("Text Polish Error:", error);
    throw error;
  }
};

// --- Image Generation Service (Aspect Ratios) ---
// Note: Requires users to select their own key via window.aistudio for gemini-3-pro-image-preview usually
export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  apiKey?: string
): Promise<string> => {
  try {
    // If apiKey is passed (from window.aistudio), use it. Otherwise fall back to env (might fail for this model if not paid/enabled).
    const ai = getAIClient(apiKey);
    
    // Using gemini-2.5-flash-image as requested for free tier support
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // imageSize is not supported in flash-image
        },
      },
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

// --- Image Editing Service (Nano Banana) ---
export const editImage = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  try {
    const ai = getAIClient();
    // Clean base64 string if it has prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: "image/png", // Assuming PNG for simplicity, usually safe for canvas exports
            },
          },
          {
            text: prompt,
          },
        ],
      },
      // No specific config needed for basic edit, the model infers from prompt + image
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    // If no image returned, maybe it returned text explaining why
    if (response.text) {
        console.warn("Model returned text instead of image:", response.text);
        throw new Error(response.text);
    }

    throw new Error("No image generated from edit");
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};