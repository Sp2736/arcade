// app/api/progress/route.ts
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

// GET: Fetch the student's current progress
export async function GET(request: Request) {
  try {
    const supabase = getServiceSupabase();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');

    if (!student_id) return NextResponse.json({ error: "Missing student_id" }, { status: 400 });

    const { data: progress, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', student_id)
      .single();

    // PGRST116 means "No rows found" - which is fine, it just means the student hasn't started yet
    if (error && error.code !== 'PGRST116') { 
       throw new Error(error.message);
    }

    // If no progress is found, return an empty array to prevent frontend errors
    return NextResponse.json({ progress: progress || { completed_nodes: [] } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save/Update the student's progress
export async function POST(request: Request) {
  try {
    const supabase = getServiceSupabase();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { student_id, target_role, completed_nodes } = await request.json();

    if (!student_id) return NextResponse.json({ error: "Missing student_id" }, { status: 400 });

    // 1. Check if a progress row already exists for this student
    const { data: existing } = await supabase
      .from('student_progress')
      .select('progress_id')
      .eq('student_id', student_id)
      .single();

    let result;
    
    if (existing) {
        // 2a. UPDATE existing row
        const { data, error } = await supabase
          .from('student_progress')
          .update({ 
              target_role, 
              completed_nodes, 
              last_updated: new Date().toISOString() 
          })
          .eq('progress_id', existing.progress_id)
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        result = data;
    } else {
        // 2b. INSERT new row
        const { data, error } = await supabase
          .from('student_progress')
          .insert([{ student_id, target_role, completed_nodes }])
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        result = data;
    }

    return NextResponse.json({ message: "Progress saved", progress: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}