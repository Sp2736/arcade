import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = getServiceSupabase();

    // 1. Log into Supabase Auth system
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    // 2. Fetch the full profile from your 'users' table using the UUID
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authData.user.id) 
      .single();

    if (dbError || !userData) {
      console.error("DB Fetch Error:", dbError);
      return NextResponse.json({ 
        error: "Auth successful, but no database profile found. Run seed script." 
      }, { status: 404 });
    }

    // 3. Return the user data to the frontend
    return NextResponse.json({ user: userData }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}