// app/api/admin/resumes/route.ts
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function GET(request: Request) {
    try {
        const supabase = getServiceSupabase();
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        
        // Fetch all pending resumes
        const { data: pendingResumes, error: dbError } = await supabase
            .from('resume_samples')
            .select(`
                resume_id, title, domain, experience_level, file_path, created_at, status,
                uploader:users!resume_samples_uploaded_by_fkey (full_name, college_id, department)
            `)
            .eq('status', 'pending_hod')
            .order('created_at', { ascending: true });

        if (dbError) throw new Error(dbError.message);

        return NextResponse.json({ pendingResumes }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = getServiceSupabase();

        // --- AUTHENTICATION & ROLE CHECK ---
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('auth_id', user.id)
            .single();
        
        if (profileError || userProfile.role !== 'faculty') {
            return NextResponse.json({ error: "Forbidden: Only faculty can verify resumes" }, { status: 403 });
        }
        // -----------------------------------

        const { resume_id, status, rejection_reason } = await request.json();

        if (!resume_id || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // 1. Update the resume status
        const { data: updatedResume, error: updateError } = await supabase
            .from('resume_samples')
            .update({
                status: status,
                rejection_reason: status === 'rejected' ? rejection_reason : null
            })
            .eq('resume_id', resume_id)
            .select('uploaded_by, title')
            .single();

        if (updateError) throw new Error(updateError.message);

        // 2. Notify the student
        const notificationTitle = status === 'approved' ? 'Resume Approved!' : 'Resume Rejected';
        const notificationMessage = status === 'approved' 
            ? `Your resume "${updatedResume.title}" has been verified and is now live in the archive.`
            : `Your resume "${updatedResume.title}" was rejected. Reason: ${rejection_reason || 'No reason provided.'}`;

        await supabase.from('notifications').insert([{
            user_id: updatedResume.uploaded_by,
            title: notificationTitle,
            message: notificationMessage,
            type: status === 'approved' ? 'success' : 'error'
        }]);

        return NextResponse.json({ message: `Resume ${status} successfully` }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}