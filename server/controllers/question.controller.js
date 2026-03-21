import Question from '../models/Question.js';

export const getQuestionsByTrack = async (req, res) => {
  const { round, difficulty, limit = 20 } = req.query;
  const filter = { track: req.params.trackId };
  if (round)      filter.round      = round;
  if (difficulty) filter.difficulty = difficulty;
  const questions = await Question.find(filter).limit(Number(limit));
  res.json(questions);
};

export const getQuestionById = async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) return res.status(404).json({ message: 'Question not found' });
  res.json(question);
};

export const createQuestion = async (req, res) => {
  const question = await Question.create(req.body);
  res.status(201).json(question);
};

export const createBulkQuestions = async (req, res) => {
  // req.body.questions = array of question objects
  const questions = await Question.insertMany(req.body.questions);
  res.status(201).json({ count: questions.length, questions });
};

export const updateQuestion = async (req, res) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!question) return res.status(404).json({ message: 'Question not found' });
  res.json(question);
};

export const deleteQuestion = async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: 'Question deleted' });
};

export const verifyQuestion = async (req, res) => {
  const question = await Question.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );
  res.json(question);
};