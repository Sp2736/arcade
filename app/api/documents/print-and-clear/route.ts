import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/src/lib/supabase';

export async function POST(request: Request) {
  try {
    const supabase = getServiceSupabase();

    // --- PHASE 1 AUTHENTICATION CHECK ---
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized: Invalid session" }, { status: 403 });
    }
    // ------------------------------------

    const body = await request.json();
    const { documentId, table, filePath } = body; 

    // 1. Delete the physical file from Storage Bucket
    const { error: storageError } = await supabase
      .storage
      .from('arcade_uploads') 
      .remove([filePath]);

    if (storageError) {
      console.error("Failed to delete file from storage:", storageError);
    }

    // 2. Delete the record from the database
    const { error: dbError } = await supabase
      .from(table)
      .delete()
      .eq(table === 'resume_samples' ? 'resume_id' : 'note_id', documentId);

    if (dbError) throw new Error("Failed to delete database record: " + dbError.message);

    return NextResponse.json({ 
        message: "Document prepped for printing and successfully purged from system to save space." 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}