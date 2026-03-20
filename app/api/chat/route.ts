import { NextResponse } from "next/server";
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(req: Request) {
  try {
    const supabase = getServiceSupabase();

    // --- AUTHENTICATION CHECK ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 403 });
    }
    // ----------------------------

    const { message } = await req.json();

    // 1. Simulate Network Delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. Default Fallback
    let mockResponse = "I can help you with details about the **ARCADE** project, its **modules**, **tech stack**, or **user roles**.";
    
    const lowerMsg = message.toLowerCase();

    // 1. GENERAL IDENTITY & SCOPE
    if (lowerMsg.includes("what is arcade") || lowerMsg.includes("about") || lowerMsg.includes("project")) {
      mockResponse = "ARCADE is a **guided academic career preparation platform**. Think of it as **Google Drive + Roadmap Visualizer + Career Advisor**, but specifically designed for the university ecosystem. It verifies content through faculty to ensure learning is directed, not random.";
    }
    // 2. TECH STACK
    else if (lowerMsg.includes("tech") || lowerMsg.includes("stack") || lowerMsg.includes("react") || lowerMsg.includes("database")) {
      mockResponse = "We use a review-safe, scalable stack:\n\n" +
        "• **Frontend:** Next.js (React) for SEO and Vercel deployment.\n" +
        "• **Backend:** Next.js API Routes + Supabase for Auth & PostgreSQL Database.\n" +
        "• **Storage:** Supabase Storage / UploadThing for files.";
    }
    // 3. RESUME
    else if (lowerMsg.includes("resume") || lowerMsg.includes("cv")) {
        mockResponse = "We have a **repository** with around 25 verified sample resumes categorized by domain. These are read-only examples uploaded by Admins to ensure privacy and quality.";
    }
    // 4. USER ROLES
    else if (lowerMsg.includes("user") || lowerMsg.includes("role") || lowerMsg.includes("who")) {
      mockResponse = "ARCADE has 4 distinct user roles:\n" +
        "1. **Student:** View/upload notes, follow roadmaps.\n" +
        "2. **Faculty:** Validate notes and suggest roadmaps.\n" +
        "3. **HOD:** Conditional authority for sensitive approvals.\n" +
        "4. **Admin:** Manages users and resources.";
    }
    // 5. CONTRIBUTING / GREETING
    else if (lowerMsg.includes("contribute") || lowerMsg.includes("git")) {
      mockResponse = "This is a closed university ecosystem project, but the code is managed via **GitHub**. For contributions, please fork the repo and check our contribution guidelines.";
    }
    else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      mockResponse = "Hello! I am the ARCADE AI. I can tell you about our **Tech Stack**, **Modules**, or how the **Notes Approval** system works.";
    }

    return NextResponse.json({ response: mockResponse }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}