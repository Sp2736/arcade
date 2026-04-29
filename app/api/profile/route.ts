import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';
import { z } from 'zod';

const ProfileUpdateSchema = z.object({
  personal_email: z.string().email().optional().nullable().or(z.literal("")),
  phone_number: z.string().max(20).optional().nullable().or(z.literal("")),
  bio: z.string().max(500).optional(),
  target_role: z.string().max(100).optional(),
  cabin_location: z.string().max(100).optional(),
  designation: z.string().max(100).optional()
});

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('last_profile_update, user_id')
      .eq('auth_id', user.id)
      .single();

    if (fetchError || !currentUser) throw new Error("Failed to verify user status");

    if (currentUser.last_profile_update) {
      const lastUpdate = new Date(currentUser.last_profile_update);
      const now = new Date();
      const diffDays = (now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);
      
      if (diffDays < 3) {
        const nextAvailableDate = new Date(lastUpdate.getTime() + (3 * 24 * 60 * 60 * 1000));
        return NextResponse.json(
          { error: `Profile edits locked. Try again after ${nextAvailableDate.toLocaleDateString()}` }, 
          { status: 429 } 
        );
      }
    }

    const rawBody = await request.json();
    const validation = ProfileUpdateSchema.safeParse(rawBody);
    if (!validation.success) return NextResponse.json({ error: "Invalid input format" }, { status: 400 });

    const { personal_email, phone_number, bio, target_role, cabin_location, designation } = validation.data;

    const updateData: any = {};
    if (personal_email !== undefined) updateData.personal_email = personal_email === "" ? null : personal_email;
    if (phone_number !== undefined) updateData.phone_number = phone_number === "" ? null : phone_number;
    if (bio !== undefined) updateData.bio = bio;
    if (target_role !== undefined) updateData.target_role = target_role;
    if (cabin_location !== undefined) updateData.cabin_location = cabin_location;
    if (designation !== undefined) updateData.designation = designation;
    
    updateData.last_profile_update = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', currentUser.user_id) 
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Success", user: data }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}