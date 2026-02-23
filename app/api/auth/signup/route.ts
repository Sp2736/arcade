import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, collegeId, department, role, adminCode } = body;
    
    // 1. Basic Security Check for Faculty
    if (role === 'faculty' && adminCode !== 'ARCADE_ADMIN_2026') {
         return NextResponse.json({ error: "Invalid Admin Verification Code" }, { status: 403 });
    }

    const supabase = getServiceSupabase();

    // 2. Create the user in Supabase Auth System
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirms email for local testing
    });

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 3. Link the new Auth ID to your Database Table
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          auth_id: authData.user.id,        // The crucial link!
          full_name: fullName,
          college_email: email,
          password_hash: 'managed_by_supabase',
          college_id: collegeId,
          department: department,
          role: role,
          is_hod: role === 'faculty',       // If faculty, make them HOD for now
          is_verified: role === 'faculty'   // Faculty auto-verified
        }
      ]);

    if (dbError) {
      console.error("DB Insert Error:", dbError.message);
      // If DB fails, we ideally should delete the Auth user, but for now we throw an error
      return NextResponse.json({ error: "Auth succeeded but Database failed. " + dbError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Account created successfully" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}