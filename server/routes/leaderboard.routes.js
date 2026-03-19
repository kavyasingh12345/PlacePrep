import express from 'express';
import { getLeaderboard, getMyScores } from '../controllers/leaderboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/',        protect, getLeaderboard);
router.get('/my',      protect, getMyScores);
export default router;