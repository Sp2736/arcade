import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🌟 THE FIX: This ensures the database query runs AS THE USER, not as an anonymous server
function getAuthenticatedClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: { headers: { Authorization: `Bearer ${token}` } }
    }
  );
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    
    // Create an authenticated client instance
    const supabase = getAuthenticatedClient(token);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const department = searchParams.get('department');

    const { data: vaultData, error: vaultError } = await supabase
      .from('notes')
      .select(`
        note_id, title, description, semester, file_path, view_count, download_count, created_at,
        uploader:users!notes_uploaded_by_fkey (full_name, role),
        verifier:users!notes_verified_by_fkey (full_name),
        subjects!inner (subject_name, department)
      `)
      .eq('status', 'approved')
      .eq('subjects.department', department)
      .order('created_at', { ascending: false });

    if (vaultError) throw new Error("Vault error: " + vaultError.message);

    const { data: myUploadsData, error: uploadsError } = await supabase
      .from('notes')
      .select(`
        note_id, title, description, semester, file_path, status, rejection_reason, created_at,
        subjects (subject_name)
      `)
      .eq('uploaded_by', userId)
      .order('created_at', { ascending: false });

    if (uploadsError) throw new Error("Uploads error: " + uploadsError.message);

    return NextResponse.json({ vaultData, myUploadsData }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    
    // Create an authenticated client instance
    const supabase = getAuthenticatedClient(token);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const body = await request.json();

    const { data: subjectData } = await supabase
      .from('subjects')
      .select('subject_id')
      .eq('subject_name', body.subject_name)
      .single();

    const subjectId = subjectData ? subjectData.subject_id : null;

    const { data, error } = await supabase
      .from('notes')
      .insert([{
        title: body.title,
        description: body.description,
        subject_id: subjectId, 
        semester: body.semester,
        file_path: body.file_path,
        uploaded_by: body.user_id,
        status: body.role === 'faculty' ? 'approved' : 'pending',
        verified_by: body.role === 'faculty' ? body.user_id : null
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Success", data }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}