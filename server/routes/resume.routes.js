import express from 'express'
import multer from 'multer'
import { analyzeResumeController } from '../controllers/resume.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// Store in memory — no disk storage needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only PDF files allowed'), false)
  },
})

router.post('/analyze', protect, upload.single('resume'), analyzeResumeController)

export default router