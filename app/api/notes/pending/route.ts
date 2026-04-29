import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);
    
    const { searchParams } = new URL(request.url);
    const facultyDept = searchParams.get('department'); 

    if (!facultyDept) return NextResponse.json({ error: "Department is required" }, { status: 400 });

    const { data: pendingNotes, error: dbError } = await supabase
      .from('notes')
      .select('note_id, title, description, semester, file_path, created_at, status, uploader:users!notes_uploaded_by_fkey (full_name, college_id, department), subjects (subject_name, department)')
      .eq('status', 'pending')
      .eq('uploader.department', facultyDept) 
      .order('created_at', { ascending: true }); 

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ pendingNotes }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch pending notes" }, { status: 500 });
  }
}