import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/src/models/User"; // Change to "@/models/User" if your @ alias points inside src/
import { dbConnect } from "@/src/lib/mongodb";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const {
      full_name,
      college_id,
      college_email,
      personal_email,
      phone_number,
      department,
      role,
      target_role,
      designation,
      cabin_location,
      password,
      adminCode
    } = body;

    if (!full_name || !college_id || !college_email || !department || !role || !password) {
      return NextResponse.json({ error: "Missing required primary fields." }, { status: 400 });
    }

    if (role === "faculty" || role === "admin") {
      const EXPECTED_CODE = process.env.ARCADE_ADMIN_SECRET || "ARCADE2026"; 
      if (adminCode !== EXPECTED_CODE) {
        return NextResponse.json({ error: "Invalid verification code for privileged role." }, { status: 403 });
      }
    }

    const existingUser = await User.findOne({ 
      $or: [{ college_email }, { college_id }] 
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this College ID or Email already exists." }, { status: 409 });
    }

    let assignedPermissions: string[] = [];
    if (role === "student") {
      assignedPermissions = ["view_resources", "upload_submissions"];
    } else if (role === "faculty") {
      if (designation === "Head of Department") {
        assignedPermissions = ["view_resources", "manage_resources", "approve_faculty_uploads", "manage_department"];
      } else {
        assignedPermissions = ["view_resources", "manage_resources"];
      }
    } else if (role === "admin") {
      assignedPermissions = ["system_admin", "manage_users", "manage_system"];
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      full_name,
      college_id,
      college_email,
      personal_email,
      phone_number,
      department,
      role,
      target_role,
      designation,
      cabin_location,
      password: hashedPassword,
      permissions: assignedPermissions
    });

    await newUser.save();

    return NextResponse.json({ 
      message: "Account created securely", 
      success: true 
    }, { status: 201 });

  } catch (error: any) {
    console.error("[BACKEND] Signup Error:", error);
    
    // This will now surface the exact Node.js or MongoDB crash reason to your frontend screen
    return NextResponse.json({ 
      error: error.message || "An unexpected server error occurred." 
    }, { status: 500 });
  }
}