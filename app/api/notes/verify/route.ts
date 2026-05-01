import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { Note, User } from '@/src/models';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role === 'student') {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { note_id, status, rejection_reason } = await req.json();

    if (!note_id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await dbConnect();

    // Get the verifier's MongoDB ObjectId
    const verifier = await User.findOne({ college_email: session.user.email }).select('_id');

    if (!verifier) {
       return NextResponse.json({ error: 'Verifier not found' }, { status: 404 });
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      note_id,
      { 
        status, 
        rejection_reason: status === 'rejected' ? rejection_reason : null,
        verified_by: verifier._id 
      },
      { new: true }
    );

    if (!updatedNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({ message: `Note ${status} successfully`, note: updatedNote });
  } catch (error: any) {
    console.error("Note Verification Error:", error);
    return NextResponse.json({ error: 'Failed to verify note' }, { status: 500 });
  }
}