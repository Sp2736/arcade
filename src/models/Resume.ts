// src/models/Resume.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResume extends Document {
  title: string;
  domain: string;
  experience_level: 'intern' | 'fresher' | 'experienced' | 'advanced';
  file_path: string;
  uploaded_by: mongoose.Types.ObjectId;
  approved_by?: mongoose.Types.ObjectId;
  status: 'pending_hod' | 'approved' | 'rejected';
  download_count: number;
  createdAt: Date;
}

const ResumeSchema = new Schema<IResume>({
  title: { type: String, required: true },
  domain: { type: String, required: true },
  experience_level: { 
    type: String, 
    required: true, 
    enum: ['intern', 'fresher', 'experienced', 'advanced'] 
  },
  file_path: { type: String, required: true },
  uploaded_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approved_by: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    default: 'pending_hod', 
    enum: ['pending_hod', 'approved', 'rejected'] 
  },
  download_count: { type: Number, default: 0 }
}, { timestamps: true });

const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);
export default Resume;