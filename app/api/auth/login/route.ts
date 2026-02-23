import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const supabase = getServiceSupabase();

    // 1. Verify password with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error("Invalid credentials.");

    // 2. Fetch the corresponding profile from your brand new 'users' table
    const { data: userProfile, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authData.user.id)
      .single();

    if (dbError || !userProfile) {
      throw new Error("Auth successful, but no database profile found.");
    }

    // 3. Update the last_login timestamp (as required by your new schema)
    await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('user_id', userProfile.user_id);

    return NextResponse.json({ user: userProfile }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}