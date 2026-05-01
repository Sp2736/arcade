import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { User } from '@/src/models';

export async function GET(req: Request) {
  try {
    // 1. Get the session securely on the server
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Connect to Mongo
    await dbConnect();

    // 3. Find the user based on the email in the secure session
    const userProfile = await User.findOne({ college_email: session.user.email })
      .select('-password_hash'); // Crucial: Never send the hash to the client

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);

  } catch (error: any) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}