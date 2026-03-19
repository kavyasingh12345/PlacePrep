import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  track:        { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  company:      { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  text:         { type: String, required: true },
  options:      [{ type: String }],         // exactly 4 strings
  correctIndex: { type: Number, required: true }, // 0-3
  explanation:  { type: String, default: '' },
  round: {
    type: String,
    enum: ['aptitude', 'technical', 'verbal', 'hr', 'coding'],
    required: true,
  },
  topic:        { type: String, default: '' },
  difficulty:   { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  year:         { type: Number },            // year this was asked
  isVerified:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);