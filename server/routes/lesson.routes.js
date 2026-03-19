import express from 'express';
import { getLessonsByTrack, getLessonById, createLesson, updateLesson, deleteLesson }
  from '../controllers/lesson.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireInstructor } from '../middleware/role.middleware.js';
import { checkEnrollment } from '../middleware/premium.middleware.js';
import { uploadVideo, uploadNotes } from '../utils/cloudinary.js';
import multer from 'multer';

const router = express.Router();
const uploadFields = multer().fields([{ name: 'video', maxCount: 1 }, { name: 'notes', maxCount: 1 }]);

router.get('/track/:trackId',   protect, checkEnrollment, getLessonsByTrack);
router.get('/:id',              protect, getLessonById);
router.post('/',                protect, requireInstructor, uploadFields, createLesson);
router.patch('/:id',            protect, requireInstructor, updateLesson);
router.delete('/:id',           protect, requireInstructor, deleteLesson);
export default router;