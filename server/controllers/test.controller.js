import MockTest from '../models/MockTest.js';
import Score from '../models/Score.js';
import { calculateScore, calculateSectionScores } from '../utils/scoreCalculator.js';

export const getTestsByTrack = async (req, res) => {
  const tests = await MockTest.find({ track: req.params.trackId, isActive: true })
    .select('-sections.questions');
  res.json(tests);
};

export const startTest = async (req, res) => {
  const test = await MockTest.findById(req.params.id)
    .populate('sections.questions');
  if (!test) return res.status(404).json({ message: 'Test not found' });

  const sanitized = test.sections.map(section => ({
    name:          section.name,
    questionCount: section.questionCount,
    questions:     section.questions.map(q => ({
      _id:     q._id,
      text:    q.text,
      options: q.options,
      topic:   q.topic,
      // correctIndex intentionally omitted
    })),
  }));

  res.json({
    _id:             test._id,
    title:           test.title,
    duration:        test.duration,
    totalQuestions:  test.totalQuestions,
    negativeMarking: test.negativeMarking,
    negativeValue:   test.negativeValue,
    sections:        sanitized,
    startedAt:       new Date(),
  });
};

export const submitTest = async (req, res) => {
  const { testId, userAnswers, timeTaken, companyId } = req.body;

  const test = await MockTest.findById(testId).populate('sections.questions');
  if (!test) return res.status(404).json({ message: 'Test not found' });

  const allQuestions = test.sections.flatMap(s => s.questions);

  const { score, maxScore, percentage, correct, wrong, skipped, answers } =
    calculateScore(allQuestions, userAnswers, test.negativeMarking, test.negativeValue);

  const sectionScores = calculateSectionScores(test.sections, userAnswers);

  const result = await Score.create({
    user:         req.user._id,
    mockTest:     testId,
    track:        test.track,
    company:      companyId || test.track,
    score,
    maxScore,
    percentage,
    timeTaken,
    answers,
    sectionScores,
    isPassed:     percentage >= test.passingScore,
  });

  res.status(201).json({
    score, maxScore, percentage,
    correct, wrong, skipped,
    sectionScores,
    isPassed:  result.isPassed,
    resultId:  result._id,
  });
};

export const createTest = async (req, res) => {
  try {
    const test = await MockTest.create(req.body);
    res.status(201).json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};