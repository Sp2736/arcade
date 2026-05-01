import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import Resume from '@/src/models/Resume';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get('domain');
    const experience = searchParams.get('experience');

    // 1. Establish database connection using the src/lib utility
    await dbConnect();

    // 2. Build the query filter
    // We only want approved resumes for the public vault
    let query: any = { status: 'approved' };
    
    if (domain) {
      query.domain = domain;
    }
    
    if (experience) {
      query.experience_level = experience;
    }

    // 3. Fetch resumes from MongoDB
    // Note: 'created_at' was renamed to 'createdAt' during migration
    const resumes = await Resume.find(query)
      .populate('uploaded_by', 'full_name') // Pulling uploader name[cite: 2]
      .sort({ createdAt: -1 });

    return NextResponse.json(resumes);
  } catch (error: any) {
    console.error("Resumes Fetch Error:", error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes from the vault' }, 
      { status: 500 }
    );
  }
}