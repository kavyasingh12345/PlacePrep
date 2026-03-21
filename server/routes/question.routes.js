import express from 'express';
import {
  getQuestionsByTrack,
  getQuestionById,
  createQuestion,
  createBulkQuestions,
  updateQuestion,
  deleteQuestion,
  verifyQuestion,
} from '../controllers/question.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireInstructor, requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/track/:trackId',   protect, getQuestionsByTrack);
router.get('/:id',              protect, getQuestionById);
router.post('/',                protect, requireInstructor, createQuestion);
router.post('/bulk',            protect, requireInstructor, createBulkQuestions);
router.patch('/:id',            protect, requireInstructor, updateQuestion);
router.delete('/:id',           protect, requireInstructor, deleteQuestion);
router.patch('/:id/verify',     protect, requireAdmin, verifyQuestion);

export default router;