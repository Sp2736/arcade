import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, collegeId, department, role, adminCode } = body;
    
    if (role === 'faculty') {
        const expectedAdminCode = process.env.FACULTY_SECRET;
        if (!expectedAdminCode || adminCode !== expectedAdminCode) {
            return NextResponse.json({ error: "Invalid Admin Verification Code" }, { status: 403 });
        }
    }

    const supabase = getServiceSupabase();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true 
    });

    if (authError) {
        return NextResponse.json({ error: "Failed to create account. Please ensure your email is valid and not already registered." }, { status: 400 });
    }

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
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error("CRITICAL: Failed to clean up orphaned auth user:", authData.user.id);
      }
      return NextResponse.json({ error: "Registration failed due to a system error. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ message: "Account created successfully" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "An unexpected system error occurred." }, { status: 500 });
  }
}