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

    const { data: profile } = await supabase.from('users').select('user_id').eq('auth_id', user.id).single();

    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile.user_id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const { data: profile } = await supabase.from('users').select('user_id').eq('auth_id', user.id).single();

    const body = await request.json();
    const notification_id = body.notification_id;

    if (!notification_id) return NextResponse.json({ error: "Missing notification ID" }, { status: 400 });

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('notification_id', notification_id)
      .eq('user_id', profile.user_id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Notification marked as read" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}