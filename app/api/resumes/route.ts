import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import { ResumeSample } from '@/src/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');

    await dbConnect();

    let query: any = { status: 'approved' };
    
    if (domain) query.domain = domain;

    const resumes = await ResumeSample.find(query)
      .populate('uploaded_by', 'full_name')
      .sort({ created_at: -1 });

    return NextResponse.json(resumes);
  } catch (error: any) {
    console.error("Resumes Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}