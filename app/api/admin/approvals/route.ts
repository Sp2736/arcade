import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ approvals: [] });
}

export async function POST() {
  return NextResponse.json({ message: "OK" });
}

