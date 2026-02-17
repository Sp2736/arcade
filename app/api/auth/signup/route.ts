// src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase'; // The utility we created earlier

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, collegeId, department, role } = body;

    const supabase = getServiceSupabase();

    // 1. Create the user in Supabase's built-in Auth system
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Insert the extended user details into our custom 'users' table
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          full_name: fullName,
          college_email: email,
          password_hash: 'managed_by_supabase_auth', // Supabase handles real passwords safely
          college_id: collegeId,
          role: role.toLowerCase(), // 'student' or 'faculty'
          department: department,
          is_hod: false, // Default to false
        }
      ]);

    if (dbError) throw dbError;

    return NextResponse.json({ message: 'User created successfully', user: authData.user }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 400 });
  }
}