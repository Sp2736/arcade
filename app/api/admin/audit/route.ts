import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/src/lib/mongodb';
import { AuditLog } from '@/src/models';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Security Check: STRICTLY Admin only
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized access. Admins only.' }, { status: 403 });
    }

    await dbConnect();

    // Fetch the latest 50 audit logs and populate the user who performed the action
    const logs = await AuditLog.find()
      .populate('user_id', 'full_name college_email role')
      .sort({ timestamp: -1 })
      .limit(50);

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("Audit Logs Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}