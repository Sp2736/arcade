import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student',
  },
  department: {
    type: String,
  },
  // Add other ARCADE-specific fields here (e.g., studentId, facultyId)
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);