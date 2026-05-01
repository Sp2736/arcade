// src/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  full_name: string;
  college_email: string;
  personal_email?: string;
  password: string; // Changed from password_hash
  college_id: string;
  role: "student" | "faculty" | "admin";
  department: string;
  bio?: string;
  phone_number?: string;
  profile_picture?: string;
  target_role?: string;
  designation?: string;
  cabin_location?: string;
  is_hod: boolean;
  last_login?: Date;
  last_profile_update?: Date;
  last_role_update?: Date;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    full_name: { type: String, required: true },
    college_email: { type: String, required: true, unique: true },
    
    // THE FIX: sparse: true prevents the E11000 error for multiple nulls
    personal_email: { type: String, unique: true, sparse: true },
    
    password: { type: String, required: true },
    college_id: { type: String, required: true, unique: true },
    role: { 
      type: String, 
      required: true, 
      enum: ["student", "faculty", "admin"] 
    },
    department: { type: String, required: true },
    bio: { type: String },
    
    // THE FIX: sparse: true here as well to prevent future phone number clashes
    phone_number: { type: String, unique: true, sparse: true },
    
    profile_picture: { type: String },
    target_role: { type: String },
    designation: { type: String },
    cabin_location: { type: String },
    is_hod: { type: Boolean, default: false },
    last_login: { type: Date },
    last_profile_update: { type: Date },
    last_role_update: { type: Date },
    is_verified: { type: Boolean, default: false },
  },
  { 
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// Prevent model recompilation error in Next.js during hot reloads
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;