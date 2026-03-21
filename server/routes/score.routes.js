import express from 'express';
import { getScoreById, getScoresByTest, deleteScore } from '../controllers/score.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/:id',              protect, getScoreById);
router.get('/test/:testId',     protect, getScoresByTest);
router.delete('/:id',          protect, requireAdmin, deleteScore);

export default router;