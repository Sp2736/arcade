import { NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongodb';
import { Subject } from '@/src/models';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    
    await dbConnect();

    // If a department is passed, filter by it. Otherwise, return all.
    const query = department ? { department } : {};
    const subjects = await Subject.find(query).sort({ subject_name: 1 });

    return NextResponse.json(subjects);
  } catch (error: any) {
    console.error("Subjects Fetch Error:", error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}