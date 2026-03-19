import express from 'express';
import { getTestsByTrack, startTest, submitTest }
  from '../controllers/test.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { checkEnrollment } from '../middleware/premium.middleware.js';

const router = express.Router();
router.get('/track/:trackId',  protect, checkEnrollment, getTestsByTrack);
router.get('/:id/start',       protect, startTest);
router.post('/submit',         protect, submitTest);
export default router;