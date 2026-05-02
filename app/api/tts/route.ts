import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '@/lib/config';

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 });

  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    return new NextResponse(buffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length.toString() }
    });
  } catch {
    return NextResponse.json({ error: 'TTS generation failed' }, { status: 500 });
  }
}
