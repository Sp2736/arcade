import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const department = searchParams.get('department');

    const supabase = getServiceSupabase();

    // 1. Fetch the Public Vault (ONLY 'approved' notes for this department)
    // We join the users table to get the author's name, and subjects table to filter by dept
    const { data: vaultData, error: vaultError } = await supabase
      .from('notes')
      .select(`
        note_id, title, description, semester, file_path, view_count, download_count, created_at,
        users!uploaded_by (full_name, role),
        users!verified_by (full_name),
        subjects!inner (subject_name, department)
      `)
      .eq('status', 'approved')
      .eq('subjects.department', department)
      .order('created_at', { ascending: false });

    if (vaultError) throw new Error("Vault fetch failed: " + vaultError.message);

    // 2. Fetch the User's Personal Uploads (Pending, Approved, and Rejected)
    const { data: myUploadsData, error: uploadsError } = await supabase
      .from('notes')
      .select(`
        note_id, title, semester, status, created_at,
        subjects (subject_name)
      `)
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false });

    if (uploadsError) throw new Error("Uploads fetch failed: " + uploadsError.message);

    return NextResponse.json({ 
      vault: vaultData || [], 
      myUploads: myUploadsData || [] 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getServiceSupabase();

    // For now, we will look up the subject_id based on the string sent from the frontend
    // In a fully optimized app, the frontend dropdown would pass the subject_id directly.
    const { data: subjectData } = await supabase
      .from('subjects')
      .select('subject_id')
      .eq('subject_name', body.subject_name)
      .single();

    const subjectId = subjectData ? subjectData.subject_id : null;

    // Insert the new note. Status defaults to 'pending' as defined in your schema.
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        title: body.title,
        description: body.description,
        subject_id: subjectId, 
        semester: body.semester,
        file_path: body.file_path, // This is holding your Google Drive Link
        uploaded_by: body.user_id,
        status: body.role === 'faculty' ? 'approved' : 'pending', // Faculty auto-approve
        verified_by: body.role === 'faculty' ? body.user_id : null
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}