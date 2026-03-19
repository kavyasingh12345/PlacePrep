import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name:       { type: String, required: true, unique: true, trim: true },
  slug:       { type: String, required: true, unique: true, lowercase: true },
  logo:       { type: String, default: '' },
  website:    { type: String, default: '' },
  branches:   [{ type: String }],   // ['CSE', 'IT', 'ECE'] — eligible branches
  minCGPA:    { type: Number, default: 0 },
  rounds:     [{ type: String }],   // ['Aptitude', 'Technical', 'HR']
  isPremium:  { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },
  ctc:        { type: String, default: '' },     // "3.5 LPA"
  bond:       { type: String, default: 'None' },
  description:{ type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Company', companySchema);