import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const supabase = getServiceSupabase();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const { data: userProfile, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authData.user.id)
      .single();

    if (dbError || !userProfile) {
      return NextResponse.json({ error: "Account details could not be retrieved. Please contact support." }, { status: 404 });
    }

    await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('user_id', userProfile.user_id);

    return NextResponse.json({ user: userProfile }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "An unexpected error occurred during login." }, { status: 500 });
  }
}