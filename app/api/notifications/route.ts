import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { Notification, User } from '@/src/models';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ college_email: session.user.email }).select('_id');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const notifications = await Notification.find({ user_id: user._id })
      .sort({ created_at: -1 })
      .limit(20);

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("Notifications Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}