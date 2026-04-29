import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';
import { z } from 'zod';

const NoteSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  subject_name: z.string(),
  semester: z.string(),
  file_path: z.string().url(),
  assigned_faculty: z.string().optional().nullable()
});

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const { data: profile } = await supabase.from('users').select('user_id').eq('auth_id', user.id).single();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');

    // Relaxed inner join to ensure all approved notes surface correctly
    const { data: vaultData, error: vaultError } = await supabase
      .from('notes')
      .select('note_id, title, description, semester, file_path, view_count, download_count, created_at, uploader:users!notes_uploaded_by_fkey (full_name, role), verifier:users!notes_verified_by_fkey (full_name), subjects (subject_name, department)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (vaultError) throw new Error("Vault error");

    const { data: myUploadsData, error: uploadsError } = await supabase
      .from('notes')
      .select('note_id, title, description, semester, file_path, status, rejection_reason, created_at, subjects (subject_name)')
      .eq('uploaded_by', profile.user_id)
      .order('created_at', { ascending: false });

    if (uploadsError) throw new Error("Uploads error");

    return NextResponse.json({ vaultData, myUploadsData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred fetching notes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const { data: profile } = await supabase.from('users').select('user_id, role, full_name').eq('auth_id', user.id).single();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const rawBody = await request.json();
    const validationResult = NoteSchema.safeParse(rawBody);
    if (!validationResult.success) return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    
    const body = validationResult.data;

    const { data: subjectData } = await supabase.from('subjects').select('subject_id').eq('subject_name', body.subject_name).single();
    const subjectId = subjectData ? subjectData.subject_id : null;

    const isFaculty = profile.role === 'faculty' || profile.role === 'hod';

    const { data, error } = await supabase.from('notes').insert([{
      title: body.title,
      description: body.description,
      subject_id: subjectId, 
      semester: body.semester,
      file_path: body.file_path,
      uploaded_by: profile.user_id,
      status: isFaculty ? 'approved' : 'pending',
      verified_by: isFaculty ? profile.user_id : null
    }]).select().single();

    if (error) throw new Error(error.message);

    // If a student selected a faculty, send them a direct notification
    if (body.assigned_faculty && !isFaculty) {
        await supabase.from('notifications').insert([{
            user_id: body.assigned_faculty,
            title: "Material Pending Review",
            message: `${profile.full_name} has uploaded a new note "${body.title}" and requested your verification.`,
            type: "info"
        }]);
    }

    return NextResponse.json({ message: "Success", data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred creating the note." }, { status: 500 });
  }
}