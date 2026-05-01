import { NextResponse } from "next/server";
import { dbConnect } from "@/src/lib/mongodb";
import User from "@/src/models/User";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let query = {};
    if (role) {
      query = { role };
    }

    // Fetch users and exclude passwords for security
    const users = await User.find(query).select("-password"); 
    
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("[BACKEND] Fetch Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}