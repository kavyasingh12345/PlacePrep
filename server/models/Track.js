import mongoose from 'mongoose';

// A Track = one prep bundle for a company
// e.g. "TCS NQT Full Prep" or "Infosys SP + PP"
const trackSchema = new mongoose.Schema({
  company:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['aptitude', 'technical', 'verbal', 'hr', 'fullpack'],
    required: true,
  },
  syllabus:    [{ topic: String, description: String }],
  thumbnail:   { type: String, default: '' },
  totalLessons:{ type: Number, default: 0 },
  duration:    { type: String, default: '' }, // "12 hours"
  difficulty:  { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isPremium:   { type: Boolean, default: false },
  status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Track', trackSchema);