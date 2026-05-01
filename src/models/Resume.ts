import mongoose, { Schema, models } from "mongoose";

const ResumeSchema = new Schema(
  {
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Resume = models.Resume || mongoose.model("Resume", ResumeSchema);
export default Resume;