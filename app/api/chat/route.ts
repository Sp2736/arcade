import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Simulate Network Delay (makes it feel real)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 2. Default Fallback
    let mockResponse = "I can help you with details about the **ARCADE** project, its **modules**, **tech stack**, or **user roles**.";
    
    const lowerMsg = message.toLowerCase();

    // --- KNOWLEDGE BASE (Based on 'Big picture.pdf') ---

    // 1. GENERAL IDENTITY & SCOPE
    if (lowerMsg.includes("what is arcade") || lowerMsg.includes("about") || lowerMsg.includes("project")) {
      mockResponse = "ARCADE is a **guided academic career preparation platform**. Think of it as **Google Drive + Roadmap Visualizer + Career Advisor**, but specifically designed for the university ecosystem[cite: 8, 9]. It verifies content through faculty to ensure learning is directed, not random[cite: 4, 5].";
    }

    // 2. TECH STACK
    else if (lowerMsg.includes("tech") || lowerMsg.includes("stack") || lowerMsg.includes("react") || lowerMsg.includes("database")) {
      mockResponse = "We use a review-safe, scalable stack:\n\n" +
        "• **Frontend:** Next.js (React) for SEO and Vercel deployment[cite: 164, 165].\n" +
        "• **Backend:** Node.js + Express[cite: 168].\n" +
        "• **Database:** PostgreSQL for structured data and relationships[cite: 172].\n" +
        "• **Deployment:** Frontend on Vercel, Backend/DB on Railway or Supabase[cite: 194, 201].";
    }

    // 3. NOTES MODULE
    else if (lowerMsg.includes("note") || lowerMsg.includes("upload") || lowerMsg.includes("approval")) {
      mockResponse = "The Notes Module is the backbone of ARCADE[cite: 46].\n\n" +
        "• **Faculty:** Can publish notes directly[cite: 50].\n" +
        "• **Students:** Can upload notes, but they go into an **approval queue** to be verified by Faculty or HOD before going live[cite: 51, 55].";
    }

    // 4. ROADMAPS
    else if (lowerMsg.includes("roadmap") || lowerMsg.includes("guide") || lowerMsg.includes("learning")) {
      mockResponse = "Our Roadmaps are visual and goal-based. You can choose paths for **Exam Prep**, **Placement Prep**, or specific **Skill Learning** [cite: 66-69]. It's designed to be a static, safe visualizer initially[cite: 72].";
    }

    // 5. SKILL GAP / ROLES
    else if (lowerMsg.includes("skill") || lowerMsg.includes("role") || lowerMsg.includes("gap")) {
      mockResponse = "This module is logic-heavy but simple. You select your current skills (e.g., Python, SQL) and a target role (e.g., Data Analyst). The system compares them and highlights **missing technologies** and **suggested improvements**[cite: 77, 86]. It uses rule-based logic, not AI, to avoid incorrect advice.";
    }

    // 6. RESUMES
    else if (lowerMsg.includes("resume") || lowerMsg.includes("cv")) {
      mockResponse = "We have a **Resume Repository** with around 25 verified sample resumes categorized by domain[cite: 99, 101]. These are read-only examples uploaded by Admins to ensure privacy and quality[cite: 102, 104].";
    }

    // 7. USER ROLES
    else if (lowerMsg.includes("user") || lowerMsg.includes("role") || lowerMsg.includes("who")) {
      mockResponse = "ARCADE has 4 distinct user roles[cite: 13]:\n" +
        "1. **Student:** View/upload notes, follow roadmaps[cite: 14].\n" +
        "2. **Faculty:** Validate notes and suggest roadmaps[cite: 22].\n" +
        "3. **HOD:** Conditional authority for sensitive approvals[cite: 27].\n" +
        "4. **Admin:** Manages users and resources[cite: 31].";
    }

    // 8. CONTRIBUTING / GREETING
    else if (lowerMsg.includes("contribute") || lowerMsg.includes("git")) {
      mockResponse = "This is a closed university ecosystem project, but the code is managed via **GitHub**[cite: 179]. For contributions, please fork the repo and check our contribution guidelines.";
    }
    else if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      mockResponse = "Hello! I am the ARCADE AI. I can tell you about our **Tech Stack**, **Modules**, or how the **Notes Approval** system works.";
    }

    // 3. Return the response
    return NextResponse.json({ text: mockResponse });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request." },
      { status: 500 }
    );
  }
}