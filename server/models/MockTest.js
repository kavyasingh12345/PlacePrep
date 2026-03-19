import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema({
  track:         { type: mongoose.Schema.Types.ObjectId, ref: 'Track', required: true },
  title:         { type: String, required: true },
  duration:      { type: Number, required: true },     // minutes
  totalQuestions:{ type: Number, required: true },
  sections: [{
    name:          String,                             // "Aptitude", "Technical"
    questionCount: Number,
    questions:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  }],
  passingScore:  { type: Number, default: 40 },        // percentage
  negativeMarking:{ type: Boolean, default: false },
  negativeValue: { type: Number, default: 0.25 },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('MockTest', mockTestSchema);