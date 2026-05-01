import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import { Note } from '@/src/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subject_id = searchParams.get('subject_id');
    const semester = searchParams.get('semester');

    await dbConnect();

    let query: any = { status: 'approved' }; // Only fetch approved notes for general viewing
    
    if (subject_id) query.subject_id = subject_id;
    if (semester) query.semester = semester;

    // Populate the uploader's details to show who posted it
    const notes = await Note.find(query)
      .populate('uploaded_by', 'full_name department')
      .populate('subject_id', 'subject_name subject_code')
      .sort({ created_at: -1 });

    return NextResponse.json(notes);
  } catch (error: any) {
    console.error("Notes Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}