import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/src/models/User"; 
import mongoose from "mongoose";
import { dbConnect } from "@/src/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();

    // ==========================================
    // 1. SEED USERS (FACULTY & HOD)
    // ==========================================
    const hashedFac1 = await bcrypt.hash("faculty1", 10);
    const hashedFac2 = await bcrypt.hash("faculty2", 10);
    const hashedHod = await bcrypt.hash("hod1", 10);

    // We removed the fake hardcoded IDs. We will let MongoDB use the real ones.
    const usersToSeed = [
      {
        full_name: "faculty1",
        college_id: "1001",
        college_email: "faculty1@charusat.ac.in",
        phone_number: "9876543210",
        department: "Computer Science and Engineering",
        role: "faculty",
        designation: "Assistant Professor",
        is_hod:true,
        is_verified:true,
        cabin_location: "Room 101",
        password: hashedFac1,
        permissions: ["view_resources", "manage_resources"]
      },
      {
        full_name: "faculty2",
        college_id: "1002",
        college_email: "faculty2@charusat.ac.in",
        phone_number: "8765432109",
        department: "Computer Engineering",
        role: "faculty",
        designation: "Assistant Professor",
        is_hod:true,
        is_verified:true,
        cabin_location: "Room 101",
        password: hashedFac2,
        permissions: ["view_resources", "manage_resources"]
      },
      {
        full_name: "hodcse",
        college_id: "1003",
        college_email: "hodcse@charusat.ac.in",
        phone_number: "7654321098",
        department: "Computer Science and Engineering",
        role: "faculty",
        designation: "Head of Department",
        is_hod:true,
        is_verified:true,
        cabin_location: "Room 102",
        password: hashedHod,
        permissions: ["view_resources", "manage_resources", "approve_faculty_uploads", "manage_department"]
      }
    ];

    // Upsert users and SAVE their actual database documents to variables
    const fac1 = await User.findOneAndUpdate(
      { college_email: usersToSeed[0].college_email },
      { $set: usersToSeed[0] },
      { upsert: true, new: true }
    );

    const fac2 = await User.findOneAndUpdate(
      { college_email: usersToSeed[1].college_email },
      { $set: usersToSeed[1] },
      { upsert: true, new: true }
    );

    const hod = await User.findOneAndUpdate(
      { college_email: usersToSeed[2].college_email },
      { $set: usersToSeed[2] },
      { upsert: true, new: true }
    );

    // ==========================================
    // 2. SEED NOTES WITH SUBJECT NAMES
    // ==========================================
    
    // Existing Student IDs mapped from your database
    const swayamId = new mongoose.Types.ObjectId("69f4c9fd33ecb10561c07fcc");
    const jalisaId = new mongoose.Types.ObjectId("69f4d00d33ecb10561c07fcd");
    const rutanshId = new mongoose.Types.ObjectId("69f4deca4e26461a0f43ddfc");

    // Use the REAL faculty IDs captured from the database (fac1._id)
    const notesToSeed = [
      {
        title: "Maths unit-1",
        subject_name: "Engineering Mathematics",
        semester: "Semester 1",
        uploaded_by: jalisaId,
        approved_by: [fac1._id, hod._id],
        file_url: "https://drive.google.com/file/d/1UHf4o0ds32Ano8bb3RcD2LWtrSQQg2-c/view?usp=drive_link",
        status: "approved"
      },
      {
        title: "DSA Arrays & Linked Lists",
        subject_name: "Data Structures",
        semester: "Semester 3",
        uploaded_by: rutanshId,
        approved_by: [fac2._id],
        file_url: "https://drive.google.com/file/d/13sQEy8SQBsWsxxPmHa4XnrUFTEIvEPlA/view?usp=drive_link",
        status: "approved"
      },
      {
        title: "OS Process Scheduling",
        subject_name: "Operating Systems",
        semester: "Semester 4",
        uploaded_by: fac1._id,
        approved_by: [fac1._id], 
        file_url: "https://drive.google.com/file/d/1ZI8F3sEM29MoqxIF1Wazp1UF4SlH1YZW/view?usp=drive_link",
        status: "approved"
      },
      {
        title: "DBMS Normalization Notes",
        subject_name: "Database Management",
        semester: "Semester 4",
        uploaded_by: rutanshId,
        approved_by: [fac2._id],
        file_url: "https://drive.google.com/file/d/1Le_Vf5I8TVYHSUThoK3vqYXv9dT_TOeG/view?usp=drive_link",
        status: "approved"
      },
      {
        title: "Web Dev React Basics",
        subject_name: "Web Development",
        semester: "Semester 4",
        uploaded_by: swayamId,
        approved_by: [fac2._id, hod._id],
        file_url: "https://drive.google.com/file/d/19P809EHT8AyXTGQSYUYvvYMMf2063V4O/view?usp=drive_link",
        status: "approved"
      },
      {
        title: "COA Pipeline Hazards",
        subject_name: "Computer Architecture",
        semester: "Semester 3",
        uploaded_by: jalisaId,
        approved_by: [fac1._id],
        file_url: "https://drive.google.com/file/d/1nFJAqr6ho_DKBE8byvb2el0_KdUy_6zJ/view?usp=drive_link",
        status: "approved"
      },
      {
        title: "SE Agile Methodologies",
        subject_name: "Software Engineering",
        semester: "Semester 6",
        uploaded_by: jalisaId,
        approved_by: [fac1._id, hod._id],
        file_url: "https://drive.google.com/file/d/1YcMVu1_v9ED2bpWpwgHLmIRwH3nF4KXM/view?usp=drive_link",
        status: "approved"
      },
      {
        title: "CN TCP/IP Model",
        subject_name: "Computer Networks",
        semester: "Semester 5",
        uploaded_by: swayamId,
        approved_by: [fac2._id],
        file_url: "https://drive.google.com/file/d/1MEJfvjlgs3v2jqU2xu2VpOXjgmQMWp6W/view?usp=drive_link",
        status: "approved"
      }
    ];

    const db = mongoose.connection.db;
    await db.collection('notes').deleteMany({ file_url: { $in: notesToSeed.map(n => n.file_url) } });
    await db.collection('notes').insertMany(notesToSeed);

    return NextResponse.json({ 
      success: true, 
      message: "Database successfully seeded with perfectly linked relationships!" 
    });

  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}