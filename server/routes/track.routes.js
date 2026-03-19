import express from 'express';
import { getTracksByCompany, getTrackById, createTrack, updateTrack, publishTrack }
  from '../controllers/track.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireInstructor, requireAdmin } from '../middleware/role.middleware.js';
import { uploadImage } from '../utils/cloudinary.js';

const router = express.Router();
router.get('/company/:companyId',   protect, getTracksByCompany);
router.get('/:id',                  protect, getTrackById);
router.post('/',                    protect, requireInstructor, uploadImage.single('thumbnail'), createTrack);
router.patch('/:id',                protect, requireInstructor, updateTrack);
router.patch('/:id/publish',        protect, requireAdmin, publishTrack);
export default router;