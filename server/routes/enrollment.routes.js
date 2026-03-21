import express from 'express'
import Enrollment from '../models/Enrollment.js'
import Progress from '../models/Progress.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/my', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate({
        path: 'track',
        populate: { path: 'company', select: 'name logo slug' }
      })
      .sort('-createdAt')

    const withProgress = await Promise.all(
      enrollments.map(async (e) => {
        try {
          const progress = await Progress.findOne({
            user:  req.user._id,
            track: e.track?._id,
          })
          return {
            ...e.toObject(),
            progressPercentage: progress?.percentage || 0,
          }
        } catch {
          return { ...e.toObject(), progressPercentage: 0 }
        }
      })
    )
    res.json(withProgress)
  } catch (err) {
    console.error('Enrollment fetch error:', err)
    res.status(500).json({ message: err.message })
  }
})

router.get('/check/:trackId', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user:  req.user._id,
      track: req.params.trackId,
    })
    res.json({ enrolled: !!enrollment, enrollment: enrollment || null })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router