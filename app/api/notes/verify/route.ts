import { NextResponse } from 'next/server';
import { getAuthSupabase } from '@/src/lib/supabase';
import { z } from 'zod';

const VerificationSchema = z.object({
  note_id: z.number().int().positive(),
  status: z.enum(['approved', 'rejected']),
  rejection_reason: z.string().optional().nullable()
});

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');
    const supabase = getAuthSupabase(token);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: "Invalid session" }, { status: 403 });

    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('user_id, role')
      .eq('auth_id', user.id)
      .single();
    
    if (profileError || userProfile?.role !== 'faculty') {
        return NextResponse.json({ error: "Forbidden: Only faculty can verify notes" }, { status: 403 });
    }

    const rawBody = await request.json();
    const validationResult = VerificationSchema.safeParse(rawBody);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const { note_id, status, rejection_reason } = validationResult.data;
    const verified_by = userProfile.user_id;

    const { data: noteData, error: noteFetchError } = await supabase
      .from('notes')
      .select('uploaded_by, title')
      .eq('note_id', note_id)
      .single();

    if (noteFetchError || !noteData) throw new Error("Note not found");

    const { data: updatedNote, error: updateError } = await supabase
      .from('notes')
      .update({
        status: status,
        rejection_reason: status === 'rejected' ? rejection_reason : null,
        verified_by: verified_by
      })
      .eq('note_id', note_id)
      .select()
      .single();

    if (updateError) throw new Error("Failed to update note");

    const notificationTitle = status === 'approved' ? 'Note Approved!' : 'Note Rejected';
    const notificationMessage = status === 'approved' 
      ? `Your note "${noteData.title}" has been verified and is now live in the vault.`
      : `Your note "${noteData.title}" was rejected. Reason: ${rejection_reason || 'No reason provided.'}`;

    await supabase.from('notifications').insert([{
      user_id: noteData.uploaded_by,
      title: notificationTitle,
      message: notificationMessage,
      type: status === 'approved' ? 'success' : 'error'
    }]);

    await supabase.from('audit_logs').insert([{
      user_id: verified_by,
      action: status === 'approved' ? 'NOTE_APPROVED' : 'NOTE_REJECTED',
      details: { note_id: note_id, title: noteData.title, rejection_reason }
    }]);

    return NextResponse.json({ message: `Note ${status} successfully`, data: updatedNote }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to verify note" }, { status: 500 });
  }
}