import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';
import { z } from 'zod';

const ProgressSchema = z.object({
    target_role: z.string().max(100).nullable().optional(),
    completed_nodes: z.array(z.string())
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
    if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { data: progress, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('student_id', profile.user_id)
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);

    return NextResponse.json({ progress: progress || { completed_nodes: [] } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Could not fetch progress" }, { status: 500 });
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

    const { data: profile } = await supabase.from('users').select('user_id').eq('auth_id', user.id).single();
    
    const rawBody = await request.json();
    const validation = ProgressSchema.safeParse(rawBody);
    if (!validation.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    const { target_role, completed_nodes } = validation.data;
    const student_id = profile.user_id;

    const { data: existing } = await supabase.from('student_progress').select('progress_id').eq('student_id', student_id).single();

    let result;
    if (existing) {
        const { data, error } = await supabase.from('student_progress').update({ 
            target_role, completed_nodes, last_updated: new Date().toISOString() 
        }).eq('progress_id', existing.progress_id).select().single();
        if (error) throw new Error(error.message);
        result = data;
    } else {
        const { data, error } = await supabase.from('student_progress').insert([{ 
            student_id, target_role, completed_nodes 
        }]).select().single();
        if (error) throw new Error(error.message);
        result = data;
    }

    return NextResponse.json({ message: "Progress saved", progress: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}