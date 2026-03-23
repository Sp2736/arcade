// app/api/resumes/route.ts
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
    const domain = searchParams.get('domain'); // e.g., 'Web Development', 'Data Science'

    let query = supabase
      .from('resume_samples')
      .select('resume_id, title, domain, experience_level, file_path, download_count')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // Filter by domain if requested by the frontend tabs
    if (domain && domain !== 'All') {
        query = query.eq('domain', domain);
    }

    const { data: resumes, error } = await query;

    if (error) throw new Error(error.message);

    return NextResponse.json({ resumes }, { status: 200 });
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

        const rawBody = await request.json();
        const { title, domain, experience_level, file_path, user_id } = rawBody;

        if (!title || !domain || !experience_level || !file_path || !user_id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase.from('resume_samples').insert([{
            title,
            domain,
            experience_level,
            file_path,
            uploaded_by: user_id,
            status: 'pending_hod' // Sent to HOD/Faculty for review
        }]);

        if (error) throw new Error(error.message);

        return NextResponse.json({ message: "Resume submitted for verification successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}