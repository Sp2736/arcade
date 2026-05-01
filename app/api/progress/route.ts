import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { StudentProgress, User } from '@/src/models';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    // Need the User's MongoDB _id to find their progress
    const user = await User.findOne({ college_email: session.user.email }).select('_id');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const progress = await StudentProgress.findOne({ student_id: user._id });
    
    return NextResponse.json(progress || { completed_nodes: [], target_role: null });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { completed_nodes, target_role } = await req.json();

    await dbConnect();
    
    const user = await User.findOne({ college_email: session.user.email }).select('_id');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Update if exists, otherwise create (upsert)
    const progress = await StudentProgress.findOneAndUpdate(
      { student_id: user._id },
      { 
        student_id: user._id,
        completed_nodes, 
        target_role,
        last_updated: new Date()
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Progress updated", progress });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}