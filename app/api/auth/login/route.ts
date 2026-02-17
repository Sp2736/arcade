import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = getServiceSupabase();

    // 1. Auth with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    // 2. Get the profile using the linked auth_id
    // Note: Make sure the column name is exactly 'auth_id' in your Supabase table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authData.user.id) 
      .single();

    if (dbError) {
      console.error("Database Error:", dbError.message);
      return NextResponse.json({ error: "Profile not found in database." }, { status: 404 });
    }

    return NextResponse.json({ user: userData }, { status: 200 });

  } catch (error: any) {
    console.error("Login Crash:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}