import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function PATCH(request: Request) {
  try {
    const supabase = getServiceSupabase();

    // 1. Strict Auth Check
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    // 2. Rate Limiting Check (3-Day Cooldown)
    const { data: currentUser, error: fetchError } = await supabase
      .from('users')
      .select('last_profile_update')
      .eq('auth_id', user.id)
      .single();

    if (fetchError) throw new Error("Failed to verify user status");

    if (currentUser?.last_profile_update) {
      const lastUpdate = new Date(currentUser.last_profile_update);
      const now = new Date();
      const diffDays = (now.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24);
      
      if (diffDays < 3) {
        const nextAvailableDate = new Date(lastUpdate.getTime() + (3 * 24 * 60 * 60 * 1000));
        return NextResponse.json(
          { error: `Profile edits locked to save resources. Try again after ${nextAvailableDate.toLocaleDateString()}` }, 
          { status: 429 } 
        );
      }
    }

    // 3. Parse Body
    const body = await request.json();
    const { personal_email, phone_number, bio, target_role, cabin_location, designation } = body;

    // 4. Prepare Update Payload (Convert empty strings to null for unique DB columns)
    const updateData: any = {};
    if (personal_email !== undefined) updateData.personal_email = personal_email === "" ? null : personal_email;
    if (phone_number !== undefined) updateData.phone_number = phone_number === "" ? null : phone_number;
    if (bio !== undefined) updateData.bio = bio;
    if (target_role !== undefined) updateData.target_role = target_role;
    if (cabin_location !== undefined) updateData.cabin_location = cabin_location;
    if (designation !== undefined) updateData.designation = designation;
    
    // Append the timestamp update to the payload to lock the next 3 days
    updateData.last_profile_update = new Date().toISOString();

    // 5. Execute Update safely using the JWT's internal user ID
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('auth_id', user.id) 
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Success", user: data }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}