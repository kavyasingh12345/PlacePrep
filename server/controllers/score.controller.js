import Score from '../models/Score.js';

export const getScoreById = async (req, res) => {
  const score = await Score.findById(req.params.id)
    .populate('mockTest', 'title duration totalQuestions sections')
    .populate('company', 'name logo')
    .populate('user', 'name avatar college branch');
  if (!score) return res.status(404).json({ message: 'Score not found' });

  // Only allow the user who took the test or an admin to see it
  if (score.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json(score);
};

export const getScoresByTest = async (req, res) => {
  const scores = await Score.find({ mockTest: req.params.testId })
    .populate('user', 'name avatar college branch')
    .sort('-percentage')
    .limit(50);
  res.json(scores);
};

export const deleteScore = async (req, res) => {
  await Score.findByIdAndDelete(req.params.id);
  res.json({ message: 'Score deleted' });
};