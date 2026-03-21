import mongoose from 'mongoose'
import Score from '../models/Score.js';

export const getLeaderboard = async (req, res) => {
  const { companyId, trackId, limit = 50 } = req.query

  const matchStage = {}
  if (companyId) matchStage.company = new mongoose.Types.ObjectId(companyId)
  if (trackId)   matchStage.track   = new mongoose.Types.ObjectId(trackId)

  const leaderboard = await Score.aggregate([
    { $match: matchStage },
    { $sort: { percentage: -1, timeTaken: 1 } },
    {
      $group: {
        _id:       '$user',
        bestScore: { $first: '$percentage' },
        timeTaken: { $first: '$timeTaken' },
        attempts:  { $sum: 1 },
      },
    },
    { $sort: { bestScore: -1, timeTaken: 1 } },
    { $limit: Number(limit) },
    {
      $lookup: {
        from:         'users',
        localField:   '_id',
        foreignField: '_id',
        as:           'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        'user.name':    1,
        'user.college': 1,
        'user.avatar':  1,
        'user.branch':  1,
        bestScore:      1,
        timeTaken:      1,
        attempts:       1,
      },
    },
  ])

  const myRank = leaderboard.findIndex(
    e => e._id.toString() === req.user._id.toString()
  ) + 1

  res.json({ leaderboard, myRank: myRank || null })
}

export const getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .populate('mockTest', 'title duration totalQuestions')
      .populate('company', 'name logo')
      .sort('-createdAt')
    res.json(scores)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}