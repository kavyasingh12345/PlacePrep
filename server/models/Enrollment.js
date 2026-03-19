import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  track:         { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  paymentStatus: { type: String, enum: ['free', 'paid', 'pending'], default: 'free' },
  amount:        { type: Number, default: 0 },
  razorpayOrderId:  { type: String },
  razorpayPaymentId:{ type: String },
  expiresAt:     { type: Date },  // null = lifetime
}, { timestamps: true });

enrollmentSchema.index({ user: 1, track: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);