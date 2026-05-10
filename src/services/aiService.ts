import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    // Fallback logic handled gracefully by UI when missing
    if (key) {
       aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

export async function submitToMedicalAI(messages: { role: 'user'|'model', text: string }[], doctorExpertise?: string) {
  const ai = getAiClient();
  if (!ai) {
    throw new Error("Gemini API Key missing. Configuration required.");
  }

  const sysInstruction = `You are a medical AI assistant for "Health AI" clinic. 
  You are helping a patient gather preliminary information before they see a doctor.
  ${doctorExpertise ? `The patient is looking to speak with a ${doctorExpertise}.` : ''}
  Ask them relevant questions one by one. Keep your answers brief, professional, and empathetic. 
  Do not diagnose, only gather information or provide basic health tips.`;

  // We are going to simulate a chat by passing the history
  // Build history string
  const historyString = messages.map(m => `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.text}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${historyString}\nAssistant:`,
    config: {
      systemInstruction: sysInstruction,
      temperature: 0.3
    }
  });

  return response.text || "I'm sorry, I couldn't process that.";
}
