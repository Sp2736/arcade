import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { Note, ResumeSample, AuditLog, User } from '@/src/models';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { document_ids, document_type } = await req.json(); // document_type: 'note' | 'resume'

    if (!document_ids || !Array.isArray(document_ids) || !document_type) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ college_email: session.user.email }).select('_id');

    // Increment download/print counts based on the type of document
    if (document_type === 'note') {
      await Note.updateMany(
        { _id: { $in: document_ids } }, 
        { $inc: { download_count: 1 } }
      );
    } else if (document_type === 'resume') {
      await ResumeSample.updateMany(
        { _id: { $in: document_ids } }, 
        { $inc: { download_count: 1 } }
      );
    }

    // Log the batch print action
    await AuditLog.create({
      user_id: user._id,
      action: `Batch printed/cleared ${document_ids.length} ${document_type}(s)`
    });

    return NextResponse.json({ 
      message: 'Documents processed and cleared successfully',
      processed_count: document_ids.length 
    });

  } catch (error: any) {
    console.error("Print and Clear Error:", error);
    return NextResponse.json({ error: 'Failed to process documents' }, { status: 500 });
  }
}