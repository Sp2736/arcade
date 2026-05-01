import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// --- CRITICAL IMPORT ---
// Ensure this path points to where your authOptions are defined
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // --- AUTHENTICATION CHECK (REPAIRED) ---
    // Passing authOptions allows NextAuth to use your SECRET to decrypt the JWT
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.error("[CHAT_AUTH_ERROR]: No session found during AI request");
      return NextResponse.json(
        { error: "Unauthorized: Invalid session" },
        { status: 403 },
      );
    }
    // ---------------------------------------

    const { messages } = await req.json();

    const systemPrompt = `You are the official AI Assistant for ARCADE, a dynamic, role-based access control university hub application. Your job is to help users navigate the platform, understand its features, and troubleshoot issues. You must be polite, concise, and highly accurate.

    CRITICAL RULES FOR ALL RESPONSES:
    1. BE EXTREMELY CONCISE: Users hate reading walls of text. Keep answers short, scannable, and strictly to the point (2-3 sentences max unless asked for a list).
    2. USE SHORT BULLETS: If explaining roles or features, use brief, one-line bullet points.
    3. NO HEADERS: Do not use Markdown headers like ###.

    Here is how the ARCADE system works post-login. The platform is divided into distinct roles:

    1. STUDENT:
    - Dashboard: Students can view their academic progress, track their learning roadmap, and manage their profile.
    - Notes: Students can upload and manage academic notes. Notes go through a pending state until verified.
    - Resumes: Students can upload, manage, and track resumes for placements.
    - Alumni Network: Students have access to an alumni directory for networking and mentorship.
    - Documents: A dedicated section for document management, including print-and-clear functionalities.

    2. FACULTY:
    - Dashboard: Faculty members have a dedicated overview of student activities.
    - Verification: Faculty are responsible for reviewing and verifying student-uploaded notes and documents.
    - Uploads: Faculty can share resources and subjects with students.

    3. ADMIN:
    - Audit Logs: Admins have access to comprehensive audit trails to monitor system activity.
    - Approvals: Admins handle high-level system approvals and user management.
    - System Oversight: Admins can oversee all resumes, notes, and user progress across the platform.

    General Features:
    - Real-time notifications are pushed for status updates (e.g., when a note is verified).
    - The platform uses strict type-checking and secure authentication to ensure data privacy.
    - Tech Stack: Next.js (React), NextAuth, MongoDB, Tailwind CSS.

    If a user asks how to do something, provide step-by-step guidance based on their role. If they ask about a feature they do not have access to, politely explain that the feature is restricted to Admin or Faculty roles.`;

    // Call Gemini 1.5 Flash (Most stable model for AI SDK)
    const { text } = await generateText({
      model: google("gemini-1.5-flash"), 
      system: systemPrompt,
      messages: messages,
      temperature: 0.7,
    });

    return NextResponse.json({ text }, { status: 200 });
  } catch (error: any) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Check server logs." },
      { status: 500 },
    );
  }
}