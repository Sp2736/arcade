import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ nextauth: ["session"] }];
}

export async function GET() {
  return NextResponse.json({
    user: {
      name: "Demo User",
      email: "demo@charusat.edu.in",
      role: "student",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });
}
