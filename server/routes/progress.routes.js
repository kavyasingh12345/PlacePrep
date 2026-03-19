import express from 'express';
import { getProgress, markLessonComplete } from '../controllers/progress.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/:trackId',      protect, getProgress);
router.post('/complete',     protect, markLessonComplete);
export default router;