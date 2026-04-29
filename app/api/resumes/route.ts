import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';
import { z } from 'zod';

const ResumeSchema = z.object({
    title: z.string().min(2).max(100),
    domain: z.string().min(2).max(50),
    experience_level: z.string().max(50),
    file_path: z.string().url()
});

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);

    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    let query = supabase.from('resume_samples').select('resume_id, title, domain, experience_level, file_path, download_count').eq('status', 'approved').order('created_at', { ascending: false });

    if (domain && domain !== 'All') {
        query = query.eq('domain', domain);
    }

    const { data: resumes, error } = await query;
    if (error) throw new Error(error.message);

    return NextResponse.json({ resumes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
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

        const { data: profile } = await supabase.from('users').select('user_id, role').eq('auth_id', user.id).single();

        const rawBody = await request.json();
        const validation = ResumeSchema.safeParse(rawBody);
        if (!validation.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

        const { title, domain, experience_level, file_path } = validation.data;
        
        // Auto-approve if the uploader is a faculty member or HOD
        const isStaff = profile.role === 'faculty' || profile.role === 'hod';

        const { data, error } = await supabase.from('resume_samples').insert([{
            title, domain, experience_level, file_path,
            uploaded_by: profile.user_id,
            status: isStaff ? 'approved' : 'pending_hod' 
        }]);

        if (error) throw new Error(error.message);

        return NextResponse.json({ message: "Resume processed successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to submit resume" }, { status: 500 });
    }
}