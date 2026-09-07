import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/jwt';

type ChatMessage = { role: 'user' | 'model'; text: string };

const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 1_200;

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (message.role === 'user' || message.role === 'model') && typeof message.text === 'string' && message.text.trim().length > 0 && message.text.length <= MAX_MESSAGE_LENGTH;
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Please sign in to use AI Health.' }, { status: 401 });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: 'AI Health is not configured yet. Please contact support or find care directly.' }, { status: 503 });

  try {
    const body = await request.json();
    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES || !messages.every(isValidMessage)) {
      return NextResponse.json({ error: 'Please send a short, valid health question.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: key });
    const history = messages.map((message) => `${message.role === 'user' ? 'Patient' : 'AI Health'}: ${message.text.trim()}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${history}\nAI Health:`,
      config: {
        systemInstruction: `You are AI Health Navigator, a preliminary healthcare guidance and triage assistant. You are speaking with an authenticated Health AI user. Be calm, empathetic, concise, and use plain language. Do not diagnose, prescribe, claim certainty, or say that the user is safe. Gather one relevant detail at a time: symptoms, timing, severity, relevant history, medicines, allergies, pregnancy status where appropriate, location, and available vital signs. Clearly encourage immediate local emergency care for possible emergency symptoms such as severe chest pain, severe breathing difficulty, fainting, stroke-like symptoms, uncontrolled bleeding, severe allergic reaction, or immediate self-harm risk. For non-emergencies, state that a clinician can assess them and offer a practical next step. End every response with a brief reminder that this is guidance, not a diagnosis. Never invent local emergency numbers or medical records.`,
        temperature: 0.2,
        maxOutputTokens: 320,
      },
    });

    const text = response.text?.trim();
    if (!text) return NextResponse.json({ error: 'AI Health could not prepare a response. Please try again or find care.' }, { status: 502 });
    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI Health request failed', error);
    return NextResponse.json({ error: 'AI Health is temporarily unavailable. Please try again or find care directly.' }, { status: 503 });
  }
}
