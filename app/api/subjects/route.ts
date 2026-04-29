import { NextResponse } from "next/server";
import { getAuthSupabase } from "@/src/lib/supabase";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const semester = searchParams.get("semester");

    let query = supabase.from("subjects").select("*");
    if (department) query = query.eq("department", department);
    if (semester && semester !== "All Semesters") query = query.eq("semester", semester);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ subjects: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}