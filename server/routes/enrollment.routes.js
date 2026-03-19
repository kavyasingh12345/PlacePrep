import express from 'express';
import Enrollment from '../models/Enrollment.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get all enrollments for the logged-in user
router.get('/my', protect, async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate({ path: 'track', populate: { path: 'company', select: 'name logo slug' } });
  res.json(enrollments);
});

// Check if enrolled in a specific track
router.get('/check/:trackId', protect, async (req, res) => {
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    track: req.params.trackId,
  });
  res.json({ enrolled: !!enrollment, enrollment });
});

export default router;