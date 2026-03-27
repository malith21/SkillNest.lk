const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
  avatar: { type: String, default: '' },

  // Academic Profile
  academicProfile: {
    degreeProgram: { type: String, default: '' },
    currentSemester: { type: String, default: '' },
    subjects: [{ type: String }],
    gpa: { type: Number, default: 0 },
    semesterGpa: { type: Number, default: 0 },
    skills: [{
      name: String,
      rating: { type: Number, min: 1, max: 5, default: 3 },
      type: { type: String, enum: ['strength', 'weakness', 'neutral'], default: 'neutral' }
    }],
    profileCompletion: { type: Number, default: 0 }
  },

  // Tutor-specific
  tutorModules: [{ type: String }],
  isAvailable: { type: Boolean, default: true },

  // Notifications
  emailNotifications: { type: Boolean, default: true },
  lastLogin: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
