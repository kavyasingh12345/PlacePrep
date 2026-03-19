import express from 'express';
import { getDashboardStats, getAllUsers, updateUserRole, sendDriveAlertToAll, approveTrack }
  from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

const router = express.Router();
router.get('/stats',            protect, requireAdmin, getDashboardStats);
router.get('/users',            protect, requireAdmin, getAllUsers);
router.patch('/users/:id/role', protect, requireAdmin, updateUserRole);
router.post('/drive-alert',     protect, requireAdmin, sendDriveAlertToAll);
router.patch('/tracks/:id/approve', protect, requireAdmin, approveTrack);
export default router;