import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

// ... existing imports and getServiceSupabase ...

export async function GET(request: Request) {
  try {
    const supabase = getServiceSupabase();
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const facultyDept = searchParams.get('department'); // Faculty's Dept

    // FIX: We now fetch pending notes where the UPLOADER belongs to the Faculty's department
    const { data: pendingNotes, error: dbError } = await supabase
      .from('notes')
      .select(`
        note_id, title, description, semester, file_path, created_at, status,
        uploader:users!notes_uploaded_by_fkey (full_name, college_id, department),
        subjects (subject_name, department)
      `)
      .eq('status', 'pending')
      // This filter ensures Faculty see students from their own department
      .eq('uploader.department', facultyDept) 
      .order('created_at', { ascending: true }); 

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ pendingNotes }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}