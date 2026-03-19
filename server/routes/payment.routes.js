import express from 'express';
import { createOrder, verifyPayment, enrollFree } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/order',        protect, createOrder);
router.post('/verify',       protect, verifyPayment);
router.post('/enroll-free',  protect, enrollFree);
export default router;