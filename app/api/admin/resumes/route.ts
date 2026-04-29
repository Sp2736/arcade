import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';
import { z } from 'zod';

const ResumeVerifySchema = z.object({
    resume_id: z.number().int().positive(),
    status: z.enum(['approved', 'rejected']),
    rejection_reason: z.string().optional().nullable()
});

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const token = authHeader.replace('Bearer ', '');
        const supabase = getAuthSupabase(token);
        
        const { data: pendingResumes, error: dbError } = await supabase
            .from('resume_samples')
            .select('resume_id, title, domain, experience_level, file_path, created_at, status, uploader:users!resume_samples_uploaded_by_fkey (full_name, college_id, department)')
            .eq('status', 'pending_hod')
            .order('created_at', { ascending: true });

        if (dbError) throw new Error(dbError.message);

        return NextResponse.json({ pendingResumes }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch pending resumes" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const token = authHeader.replace('Bearer ', '');
        const supabase = getAuthSupabase(token);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('user_id, role')
            .eq('auth_id', user.id)
            .single();
        
        if (profileError || userProfile?.role !== 'faculty') {
            return NextResponse.json({ error: "Forbidden: Only faculty can verify resumes" }, { status: 403 });
        }

        const rawBody = await request.json();
        const validation = ResumeVerifySchema.safeParse(rawBody);
        if (!validation.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

        const { resume_id, status, rejection_reason } = validation.data;

        const { data: updatedResume, error: updateError } = await supabase
            .from('resume_samples')
            .update({
                status: status,
                rejection_reason: status === 'rejected' ? rejection_reason : null
            })
            .eq('resume_id', resume_id)
            .select('uploaded_by, title')
            .single();

        if (updateError || !updatedResume) throw new Error("Update failed");

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

        await supabase.from('audit_logs').insert([{
            user_id: userProfile.user_id,
            action: status === 'approved' ? 'RESUME_APPROVED' : 'RESUME_REJECTED',
            details: { resume_id: resume_id, title: updatedResume.title, rejection_reason }
        }]);

        return NextResponse.json({ message: `Resume ${status} successfully` }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
    }
}