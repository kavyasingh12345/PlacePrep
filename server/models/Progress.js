import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  track:            { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  percentage:       { type: Number, default: 0 },
  lastLesson:       { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
}, { timestamps: true });

progressSchema.index({ user: 1, track: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);