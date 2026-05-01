import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/src/lib/mongodb';
import { User } from '@/src/models';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, college_email, password, college_id, role, department } = body;

    // Validate required fields based on our schema
    if (!full_name || !college_email || !password || !college_id || !department) {
      return NextResponse.json(
        { error: 'Required fields are missing (full_name, college_email, password, college_id, department).' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if the user already exists by email OR college ID
    const existingUser = await User.findOne({ 
      $or: [{ college_email }, { college_id }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email or college ID already exists.' },
        { status: 409 }
      );
    }

    // Hash the password securely (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in MongoDB
    const newUser = await User.create({
      full_name,
      college_email,
      password_hash: hashedPassword,
      college_id,
      role: role || 'student', // Default to student
      department
    });

    const userToReturn = {
      id: newUser._id.toString(),
      full_name: newUser.full_name,
      college_email: newUser.college_email,
      role: newUser.role,
    };

    return NextResponse.json(
      { message: 'User created successfully.', user: userToReturn },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: 'An error occurred during signup.', details: error.message },
      { status: 500 }
    );
  }
}