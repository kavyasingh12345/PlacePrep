import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mockTest:   { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
  track:      { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  company:    { type: mongoose.Schema.Types.ObjectId, ref: 'Company'},
  score:      { type: Number, required: true },
  maxScore:   { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken:  { type: Number, required: true }, // seconds
  answers:    [{ questionId: mongoose.Schema.Types.ObjectId, selected: Number, correct: Boolean }],
  sectionScores: [{ section: String, score: Number, total: Number }],
  isPassed:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Score', scoreSchema);