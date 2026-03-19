import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String },
  googleId:     { type: String },
  avatar:       { type: String, default: '' },
  branch:       { type: String, default: '' },   // CSE, ECE, IT etc.
  college:      { type: String, default: '' },
  gradYear:     { type: Number },                // 2025, 2026 etc.
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  isVerified:   { type: Boolean, default: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.googleId;
  return obj;
};

export default mongoose.model('User', userSchema);