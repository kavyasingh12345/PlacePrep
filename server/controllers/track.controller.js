import Track from '../models/Track.js';
import Enrollment from '../models/Enrollment.js';

export const getTracksByCompany = async (req, res) => {
  const isAdmin = req.user?.role === 'admin'

  const filter = { company: req.params.companyId }
  if (!isAdmin) filter.status = 'published'  // students only see published

  const tracks = await Track.find(filter)
    .populate('company', 'name logo')
    .populate('createdBy', 'name')

  res.json(tracks)
}

export const getMyTracks = async (req, res) => {
  const tracks = await Track.find({ createdBy: req.user._id })
    .populate('company', 'name logo slug')
    .sort('-createdAt');
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

export const deleteTrack = async (req, res) => {
  try {
    const track = await Track.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!track) return res.status(404).json({ message: 'Track not found or unauthorized' });
    res.json({ message: 'Track deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};