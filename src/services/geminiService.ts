import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are 'MyEyes Bot', an AI Style and Optical Consultant for My Eyes in Pakistan.
Your goal is to help users choose glasses, explain the subscription model, and provide eye care tips.

Key Information about My Eyes:
- We are a subscription service launching Jan 1, 2026.
- Pre-launch Offer: Pay PKR 1000 now for the *First Year Annual Membership* (Regular price will be thousands of PKR after launch).
- Benefits: Buy 1 Get 1 Free (BOGO) for life, AI Face Shape Analysis, Style Quiz, and 48-hour early access.
- Launch Process: Users register their phone number now. On Jan 1, they get a WhatsApp link to shop.
- Premium high-index lenses, anti-glare included.
- Currently serving Islamabad & Rawalpindi with free 24h delivery, nationwide shipping available at extra cost.

Tone: Professional, modern, friendly, and helpful.
Keep answers concise (under 100 words unless asked for detail).
`;

// Lazy initialization wrapper
let aiClient: GoogleGenAI | null = null;

const getApiKey = (): string => {
  try {
    // Check if process is defined as a global variable
    if (typeof process !== 'undefined' && process.env) {
      return process.env.API_KEY || '';
    }
  } catch (e) {
    // Ignore ReferenceError if process is not defined
    console.warn("Could not access process.env");
  }
  return '';
};

const getAiClient = (): GoogleGenAI | null => {
  if (aiClient) return aiClient;

  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }

  try {
    aiClient = new GoogleGenAI({ apiKey });
    return aiClient;
  } catch (error) {
    console.error("Failed to initialize Gemini client:", error);
    return null;
  }
};

export const sendMessageToGemini = async (history: {role: string, text: string}[], newMessage: string): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) {
    return "I'm sorry, the AI service is currently unavailable. Please check the API key configuration.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    const conversationContext = history.map(msg => `${msg.role === 'user' ? 'User' : 'MyEyes Bot'}: ${msg.text}`).join('\n');
    const prompt = `${conversationContext}\nUser: ${newMessage}\nMyEyes Bot:`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });

    return response.text || "I apologize, I didn't quite catch that. Could you please rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};