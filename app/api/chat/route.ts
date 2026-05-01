import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Security: Block unauthorized users from using the AI
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `You are the ARCADE AI Assistant, a centralized, highly intelligent guide for university students and faculty. 
      You are concise, logistics-driven, and highly analytical. Keep responses sharp and strictly relevant to the university ecosystem.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" }, 
      { status: 500 }
    );
  }
}