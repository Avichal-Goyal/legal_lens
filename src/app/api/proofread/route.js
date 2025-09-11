import { NextResponse } from 'next/server.js';
import { proofreadTextWithGemini } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: text is required and must be a string' },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: 'Text exceeds maximum length of 10,000 characters' },
        { status: 400 }
      );
    }

    const proofreadResult = await proofreadTextWithGemini(text);
    return NextResponse.json(proofreadResult, { status: 200 });

  } catch (error) {
    console.error('Proofread API error:', error);

    if (error.message.includes('Failed to proofread text')) {
      return NextResponse.json(
        { error: 'Proofreading service temporarily unavailable' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}