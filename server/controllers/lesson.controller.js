import Lesson from '../models/Lesson.js';
import Track from '../models/Track.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

export const getLessonsByTrack = async (req, res) => {
  const lessons = await Lesson.find({ track: req.params.trackId }).sort('order');
  res.json(lessons);
};

export const getLessonById = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
  res.json(lesson);
};

export const createLesson = async (req, res) => {
  const { trackId, title, topic, order, isFree, description } = req.body;

  const lesson = await Lesson.create({
    track:    trackId,
    title,
    topic,
    order,
    isFree,
    description,
    videoUrl: req.body.videoUrl || req.files?.video?.[0]?.path || '',
    videoPublicId: req.files?.video?.[0]?.filename || '',
    notesUrl:      req.files?.notes?.[0]?.path || '',
    duration:      req.body.duration || 0,
  });

  // Increment lesson count on track
  await Track.findByIdAndUpdate(trackId, { $inc: { totalLessons: 1 } });

  res.status(201).json(lesson);
};

export const updateLesson = async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(lesson);
};

export const deleteLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

  if (lesson.videoPublicId) {
    await deleteFromCloudinary(lesson.videoPublicId, 'video');
  }
  await lesson.deleteOne();
  await Track.findByIdAndUpdate(lesson.track, { $inc: { totalLessons: -1 } });
  res.json({ message: 'Lesson deleted' });
};