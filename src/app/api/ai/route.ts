import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Gemini API Key missing. Configuration required." },
      { status: 500 }
    );
  }

  try {
    const { messages, doctorExpertise } = await request.json();

    const ai = new GoogleGenAI({ apiKey: key });

    const sysInstruction = `You are a medical AI assistant for "Health AI" clinic. 
  You are helping a patient gather preliminary information before they see a doctor.
  ${doctorExpertise ? `The patient is looking to speak with a ${doctorExpertise}.` : ''}
  Ask them relevant questions one by one. Keep your answers brief, professional, and empathetic. 
  Do not diagnose, only gather information or provide basic health tips.`;

    const historyString = messages
      .map((m: { role: string; text: string }) =>
        `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.text}`
      )
      .join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${historyString}\nAssistant:`,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.3,
      },
    });

    return NextResponse.json({
      text: response.text || "I'm sorry, I couldn't process that.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "AI service error" },
      { status: 500 }
    );
  }
}
