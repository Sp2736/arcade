import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({ reply: "Demo AI Assistant active in browser" });
}
