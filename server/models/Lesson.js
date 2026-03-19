import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  track:       { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  title:       { type: String, required: true },
  videoUrl:    { type: String, default: '' },       // Cloudinary URL
  videoPublicId:{ type: String, default: '' },      // for deletion
  duration:    { type: Number, default: 0 },        // seconds
  notesUrl:    { type: String, default: '' },       // Cloudinary PDF URL
  topic:       { type: String, required: true },    // "Percentages", "Arrays" etc.
  order:       { type: Number, required: true },
  isFree:      { type: Boolean, default: false },   // preview lessons
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);