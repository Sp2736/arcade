// app/api/subjects/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Prioritize Service Role Key for backend routing if available, fallback to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const semester = searchParams.get("semester");

    let query = supabase.from("subjects").select("*");

    // Filter by department if provided
    if (department) {
      query = query.eq("department", department);
    }

    // Filter by semester if provided and not 'All Semesters'
    if (semester && semester !== "All Semesters") {
      query = query.eq("semester", semester);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ subjects: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}