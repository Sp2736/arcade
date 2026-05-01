import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  college_email: { type: String, required: true, unique: true },
  personal_email: { type: String, unique: true, sparse: true },
  password_hash: { type: String, required: true },
  college_id: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['student', 'faculty', 'admin'] },
  department: { type: String, required: true },
  bio: String,
  phone_number: String,
  profile_picture: String,
  target_role: String,
  designation: String,
  cabin_location: String,
  is_hod: { type: Boolean, default: false },
  last_login: Date,
  last_profile_update: Date,
  last_role_update: Date,
  is_verified: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const SubjectSchema = new mongoose.Schema({
  subject_name: { type: String, required: true },
  subject_code: { type: String, unique: true, sparse: true },
  semester: { type: String, required: true },
  department: { type: String, required: true }
});

const FacultyTeachingLoadSchema = new mongoose.Schema({
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  is_theory: { type: Boolean, default: false },
  is_practical: { type: Boolean, default: false }
});

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  semester: String,
  file_path: { type: String, required: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verified_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejection_reason: String,
  download_count: { type: Number, default: 0 },
  view_count: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const NotificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  is_read: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const ResumeSampleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  domain: { type: String, required: true },
  experience_level: { type: String, enum: ['intern', 'fresher', 'experienced', 'advanced'] },
  file_path: { type: String, required: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending_hod', 'approved', 'rejected'], default: 'pending_hod' },
  rejection_reason: String,
  download_count: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const StudentProgressSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  target_role: String,
  completed_nodes: { type: Array, default: [] },
  last_updated: { type: Date, default: Date.now }
});

const AuditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String, required: true },
  details: mongoose.Schema.Types.Mixed,
  ip_address: String,
  timestamp: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
export const FacultyTeachingLoad = mongoose.models.FacultyTeachingLoad || mongoose.model('FacultyTeachingLoad', FacultyTeachingLoadSchema);
export const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export const ResumeSample = mongoose.models.ResumeSample || mongoose.model('ResumeSample', ResumeSampleSchema);
export const StudentProgress = mongoose.models.StudentProgress || mongoose.model('StudentProgress', StudentProgressSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);