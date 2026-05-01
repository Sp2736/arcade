import mongoose, { Schema, models } from "mongoose";

const NoteSchema = new Schema(
  {
    studentId: { type: String, required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    assignedFacultyId: { type: String, required: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const Note = models.Note || mongoose.model("Note", NoteSchema);
export default Note;