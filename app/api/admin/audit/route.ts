import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const token = authHeader.replace('Bearer ', '');
        const supabase = getAuthSupabase(token);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('is_hod, department')
            .eq('auth_id', user.id)
            .single();

        if (profileError || !userProfile?.is_hod) {
            return NextResponse.json({ error: "Forbidden: Access restricted to HODs only." }, { status: 403 });
        }

        const { data: logs, error: logsError } = await supabase
            .from('audit_logs')
            .select('log_id, action, details, timestamp, users (full_name, role, department)')
            .order('timestamp', { ascending: false })
            .limit(100);

        if (logsError) throw new Error(logsError.message);

        return NextResponse.json({ logs }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }
}