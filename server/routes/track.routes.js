import express from 'express';
import {
  getTracksByCompany,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
  publishTrack,
  getMyTracks,
} from '../controllers/track.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireInstructor, requireAdmin } from '../middleware/role.middleware.js';
import { uploadImage } from '../utils/cloudinary.js';

const router = express.Router();

router.get('/my',                   protect, getMyTracks);
router.get('/company/:companyId',   protect, getTracksByCompany);
router.get('/:id',                  protect, getTrackById);
router.post('/',                    protect, requireInstructor, uploadImage.single('thumbnail'), createTrack);
router.patch('/:id',                protect, requireInstructor, updateTrack);
router.patch('/:id/publish',        protect, requireAdmin, publishTrack);
router.delete('/:id',               protect, requireInstructor, deleteTrack);

export default router;