import { NextResponse } from "next/server";

/**
 * Mock NextAuth Route Handler
 * Returns active session mock payload for client-side demo execution.
 */
export async function GET() {
  return NextResponse.json({
    user: {
      name: "Swayam Patel",
      email: "24dcs088@charusat.edu.in",
      role: "student",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    url: "/api/auth/callback/credentials",
    ok: true,
    status: 200,
  });
}

