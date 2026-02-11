// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = getServiceSupabase();

    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Fetch the user's custom details (Role, Department, etc.)
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('college_email', email)
      .single();

    if (dbError) throw dbError;

    // Return the session and custom user data
    return NextResponse.json({ 
      message: 'Login successful', 
      session: authData.session,
      user: userData 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Invalid login credentials' }, { status: 401 });
  }
}