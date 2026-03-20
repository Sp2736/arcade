import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = getServiceSupabase();
    
    // --- AUTHENTICATION CHECK ---
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    // ----------------------------

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    const { data: progress, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId)
      .single();

    // If no progress exists yet, return empty array instead of failing
    if (error && error.code !== 'PGRST116') throw new Error(error.message);

    return NextResponse.json({ progress: progress || { completed_nodes: [] } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServiceSupabase();
    
    // --- AUTHENTICATION CHECK ---
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    // ----------------------------

    const body = await request.json();
    const { student_id, target_role, completed_nodes } = body;

    // Upsert: Update if exists, insert if it doesn't
    const { data, error } = await supabase
      .from('student_progress')
      .upsert({
        student_id: student_id,
        target_role: target_role,
        completed_nodes: completed_nodes,
        last_updated: new Date().toISOString()
      }, { onConflict: 'student_id' })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Progress saved", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}