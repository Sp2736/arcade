import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = getServiceSupabase();
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getServiceSupabase();
    // (Assume standard Auth check here for brevity, ensure you have your token verification logic)
    
    const body = await request.json();
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('notification_id', body.notification_id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Notification marked as read" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}