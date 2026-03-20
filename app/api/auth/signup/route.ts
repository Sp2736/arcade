import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, collegeId, department, role, adminCode } = body;
    
    // Security Check: Use environment variable instead of hardcoded secret
    if (role === 'faculty') {
        const expectedAdminCode = process.env.FACULTY_SECRET;
        if (!expectedAdminCode || adminCode !== expectedAdminCode) {
            return NextResponse.json({ error: "Invalid Admin Verification Code" }, { status: 403 });
        }
    }

    const supabase = getServiceSupabase();

    // 1. Create the user in Supabase Auth System
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true 
    });

    if (authError) throw new Error(authError.message);

    // 2. Link the Auth ID to your new Database Table
    const { error: dbError } = await supabase
      .from('users')
      .insert([
        {
          auth_id: authData.user.id,
          full_name: fullName,
          college_email: email,
          password_hash: 'managed_by_supabase',
          college_id: collegeId,
          department: department,
          role: role,
          is_hod: role === 'faculty',
          is_verified: role === 'faculty'
        }
      ]);

    if (dbError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error("Database failed: " + dbError.message);
    }

    return NextResponse.json({ message: "Account created successfully" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}