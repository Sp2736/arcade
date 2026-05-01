import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { User } from '@/src/models';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    // Fetching based on the email in your JSON
    const userProfile = await User.findOne({ college_email: session.user.email }).select('-password_hash');

    if (!userProfile) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(userProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}