import Track from '../models/Track.js';
import Enrollment from '../models/Enrollment.js';

export const getTracksByCompany = async (req, res) => {
  const tracks = await Track.find({
    company: req.params.companyId,
    status: 'published',
  }).populate('company', 'name logo');
  res.json(tracks);
};

export const getTrackById = async (req, res) => {
  const track = await Track.findById(req.params.id)
    .populate('company', 'name logo slug rounds')
    .populate('createdBy', 'name');
  if (!track) return res.status(404).json({ message: 'Track not found' });

  // Attach enrollment status if user is logged in
  let enrolled = false;
  if (req.user) {
    enrolled = !!(await Enrollment.findOne({ user: req.user._id, track: track._id }));
  }
  res.json({ ...track.toObject(), enrolled });
};

export const createTrack = async (req, res) => {
  const track = await Track.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(track);
};

export const updateTrack = async (req, res) => {
  const track = await Track.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(track);
};

export const publishTrack = async (req, res) => {
  const track = await Track.findByIdAndUpdate(
    req.params.id,
    { status: 'published' },
    { new: true }
  );
  res.json(track);
};