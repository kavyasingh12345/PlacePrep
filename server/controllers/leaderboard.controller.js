import Score from '../models/Score.js';

export const getLeaderboard = async (req, res) => {
  const { companyId, trackId, limit = 50 } = req.query;

  const matchStage = {};
  if (companyId) matchStage.company = companyId;
  if (trackId)   matchStage.track   = trackId;

  const leaderboard = await Score.aggregate([
    { $match: matchStage },
    { $sort: { percentage: -1, timeTaken: 1 } },
    {
      $group: {
        _id:        '$user',
        bestScore:  { $first: '$percentage' },
        timeTaken:  { $first: '$timeTaken' },
        attempts:   { $sum: 1 },
        scoreId:    { $first: '$_id' },
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
        'user.name':     1,
        'user.college':  1,
        'user.avatar':   1,
        'user.branch':   1,
        bestScore:       1,
        timeTaken:       1,
        attempts:        1,
      },
    },
  ]);

  // Attach current user's rank
  const myEntry = leaderboard.findIndex(e => e._id.toString() === req.user._id.toString());

  res.json({ leaderboard, myRank: myEntry + 1 || null });
};

export const getMyScores = async (req, res) => {
  const scores = await Score.find({ user: req.user._id })
    .populate('mockTest', 'title')
    .populate('company', 'name logo')
    .sort('-createdAt');
  res.json(scores);
};