import Progress from '../models/Progress.js';
import Track from '../models/Track.js';

export const getProgress = async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    track: req.params.trackId,
  }).populate('completedLessons', 'title order');

  res.json(progress || { completedLessons: [], percentage: 0 });
};

export const markLessonComplete = async (req, res) => {
  const { trackId, lessonId } = req.body;

  const track = await Track.findById(trackId);
  if (!track) return res.status(404).json({ message: 'Track not found' });

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id, track: trackId },
    {
      $addToSet: { completedLessons: lessonId },
      $set:      { lastLesson: lessonId },
    },
    { upsert: true, new: true }
  );

  // Recalculate percentage
  const totalLessons = track.totalLessons || 1;
  progress.percentage = Math.round((progress.completedLessons.length / totalLessons) * 100);
  await progress.save();

  res.json(progress);
};