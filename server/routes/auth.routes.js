import express from 'express';
import passport from 'passport';
import { register, login, logout, googleCallback, getMe, updateProfile }
  from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/register',  register);
router.post('/login',     login);
router.post('/logout',    logout);
router.get('/me',         protect, getMe);
router.patch('/profile',  protect, updateProfile);
router.get('/google',     passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);
export default router;