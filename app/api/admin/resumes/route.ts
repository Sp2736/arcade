import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { ResumeSample } from '@/src/models';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Security Check: Only Admins (or HODs depending on your exact setup)
    if (!session?.user || !['admin', 'faculty'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    const { resume_id, status, rejection_reason } = await req.json();

    if (!resume_id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await dbConnect();

    const updatedResume = await ResumeSample.findByIdAndUpdate(
      resume_id,
      { 
        status, 
        rejection_reason: status === 'rejected' ? rejection_reason : null 
      },
      { new: true }
    );

    if (!updatedResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ message: `Resume ${status} successfully`, resume: updatedResume });
  } catch (error: any) {
    console.error("Resume Approval Error:", error);
    return NextResponse.json({ error: 'Failed to update resume status' }, { status: 500 });
  }
}