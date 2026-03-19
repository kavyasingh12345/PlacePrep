import User from '../models/User.js';
import Company from '../models/Company.js';
import Track from '../models/Track.js';
import Score from '../models/Score.js';
import Enrollment from '../models/Enrollment.js';
import { sendDriveAlert } from '../utils/mailer.js';

export const getDashboardStats = async (req, res) => {
  const [totalUsers, totalCompanies, totalTracks, totalEnrollments] = await Promise.all([
    User.countDocuments(),
    Company.countDocuments(),
    Track.countDocuments({ status: 'published' }),
    Enrollment.countDocuments({ paymentStatus: 'paid' }),
  ]);
  res.json({ totalUsers, totalCompanies, totalTracks, totalEnrollments });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find().select('-passwordHash').sort('-createdAt');
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  ).select('-passwordHash');
  res.json(user);
};

export const sendDriveAlertToAll = async (req, res) => {
  const { companyName, role, date, applyLink, branches, gradYear } = req.body;

  const filter = {};
  if (branches?.length)  filter.branch   = { $in: branches };
  if (gradYear)          filter.gradYear = gradYear;

  const users = await User.find(filter).select('email name');

  await Promise.allSettled(
    users.map(u => sendDriveAlert({ to: u.email, name: u.name, companyName, role, date, applyLink }))
  );

  res.json({ message: `Drive alert sent to ${users.length} students` });
};

export const approveTrack = async (req, res) => {
  const track = await Track.findByIdAndUpdate(
    req.params.id,
    { status: 'published' },
    { new: true }
  );
  res.json(track);
};