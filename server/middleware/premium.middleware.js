import Enrollment from '../models/Enrollment.js';
import Track from '../models/Track.js';

// Blocks access to premium track content unless enrolled
export const checkEnrollment = async (req, res, next) => {
  const trackId = req.params.trackId || req.body.trackId || req.query.trackId;
  if (!trackId) return next();

  const track = await Track.findById(trackId);
  if (!track) return res.status(404).json({ message: 'Track not found' });

  // Free tracks — always accessible
  if (!track.isPremium) return next();

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    track: trackId,
    paymentStatus: { $in: ['free', 'paid'] },
  });

  if (!enrollment) {
    return res.status(403).json({
      message: 'Premium track — enrollment required',
      isPremium: true,
      trackId,
    });
  }
  next();
};