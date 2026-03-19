import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const companies = [
  {
    name: 'TCS',
    slug: 'tcs',
    website: 'https://www.tcs.com',
    branches: ['CSE', 'IT', 'ECE', 'EEE', 'Mech'],
    minCGPA: 6.0,
    rounds: ['TCS NQT', 'Technical Interview', 'HR Interview'],
    isPremium: false,
    ctc: '3.5 LPA',
    description: 'TCS NQT is a national level test conducted by TCS.',
  },
  {
    name: 'Infosys',
    slug: 'infosys',
    website: 'https://www.infosys.com',
    branches: ['CSE', 'IT', 'ECE', 'EEE'],
    minCGPA: 6.5,
    rounds: ['Online Test', 'Technical Interview', 'HR Interview'],
    isPremium: false,
    ctc: '3.6 LPA',
    description: 'Infosys SP and PP hiring through online assessment.',
  },
  {
    name: 'Wipro',
    slug: 'wipro',
    website: 'https://www.wipro.com',
    branches: ['CSE', 'IT', 'ECE'],
    minCGPA: 6.0,
    rounds: ['NLTH Test', 'Technical Interview', 'HR'],
    isPremium: false,
    ctc: '3.5 LPA',
    description: 'Wipro NLTH hiring for entry-level roles.',
  },
  {
    name: 'Cognizant',
    slug: 'cognizant',
    website: 'https://www.cognizant.com',
    branches: ['CSE', 'IT', 'ECE', 'EEE'],
    minCGPA: 6.0,
    rounds: ['GenC Test', 'Technical Interview', 'HR'],
    isPremium: true,
    ctc: '4 LPA',
    description: 'Cognizant GenC and GenC Next programs.',
  },
  {
    name: 'Accenture',
    slug: 'accenture',
    website: 'https://www.accenture.com',
    branches: ['CSE', 'IT', 'ECE', 'EEE', 'Mech'],
    minCGPA: 6.0,
    rounds: ['Cognitive Assessment', 'Technical Interview', 'HR'],
    isPremium: true,
    ctc: '4.5 LPA',
    description: 'Accenture ASE and package hiring.',
  },
];

await Company.deleteMany({});
await Company.insertMany(companies);
console.log('Seed complete — 5 companies added');
process.exit(0);