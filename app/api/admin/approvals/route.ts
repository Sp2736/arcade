import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { User, AuditLog } from '@/src/models';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Security Check: Only Admins can approve users
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access. Admins only.' }, { status: 403 });
    }

    const { target_user_id, action } = await req.json();

    if (!target_user_id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    await dbConnect();

    const adminUser = await User.findOne({ college_email: session.user.email }).select('_id');

    if (action === 'approve') {
      const updatedUser = await User.findByIdAndUpdate(
        target_user_id, 
        { is_verified: true }, 
        { new: true }
      ).select('-password_hash');

      // Log the action for security audits
      await AuditLog.create({
        user_id: adminUser._id,
        action: `Approved user account: ${updatedUser?.college_email}`
      });

      return NextResponse.json({ message: 'User approved successfully', user: updatedUser });
    } 
    
    if (action === 'reject') {
      const deletedUser = await User.findByIdAndDelete(target_user_id);
      
      await AuditLog.create({
        user_id: adminUser._id,
        action: `Rejected and removed user account: ${deletedUser?.college_email}`
      });

      return NextResponse.json({ message: 'User rejected and removed from system' });
    }

  } catch (error: any) {
    console.error("Admin Approval Error:", error);
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 });
  }
}