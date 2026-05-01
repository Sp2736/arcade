import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    college_id: { type: String, required: true, unique: true },
    college_email: { type: String, required: true, unique: true },
    personal_email: { type: String, default: null },
    phone_number: { type: String, default: null },
    department: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["student", "faculty", "admin"], 
      required: true 
    },
    target_role: { type: String, default: null },
    designation: { 
      type: String, 
      enum: ["Assistant Professor", "Head of Department", "System Administrator", null], 
      default: null 
    },
    cabin_location: { type: String, default: null },
    password: { type: String, required: true },
    permissions: [{ type: String }] // Stores specific operational rights
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);