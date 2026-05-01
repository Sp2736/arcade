import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/src/lib/mongodb';
import { User } from '@/src/models';

export async function POST(req: Request) {
  try {
    const { college_email, password } = await req.json();

    if (!college_email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ college_email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        full_name: user.full_name,
        college_email: user.college_email,
        role: user.role,
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'An error occurred during login.', details: error.message },
      { status: 500 }
    );
  }
}