import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { Note } from '@/src/models';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Security Check: Only Faculty and Admins can view pending notes
    if (!session?.user || (session.user as any).role === 'student') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    await dbConnect();

    // Fetch notes with 'pending' status and populate related data
    const pendingNotes = await Note.find({ status: 'pending' })
      .populate('uploaded_by', 'full_name college_id')
      .populate('subject_id', 'subject_name subject_code semester')
      .sort({ created_at: 1 }); // Oldest first to clear backlog

    return NextResponse.json(pendingNotes);
  } catch (error: any) {
    console.error("Pending Notes Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch pending notes' }, { status: 500 });
  }
}