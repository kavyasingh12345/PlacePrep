import crypto from 'crypto';
import { razorpay } from '../utils/razorpay.js';
import Enrollment from '../models/Enrollment.js';
import Track from '../models/Track.js';
import { sendEnrollmentConfirmation } from '../utils/mailer.js';

export const createOrder = async (req, res) => {
  const { trackId } = req.body;
  const track = await Track.findById(trackId).populate('company', 'name');
  if (!track) return res.status(404).json({ message: 'Track not found' });

  const amount = 49900; // ₹499 in paise — adjust as needed

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt:  `receipt_${req.user._id}_${trackId}`,
  });

  // Create pending enrollment
  await Enrollment.findOneAndUpdate(
    { user: req.user._id, track: trackId },
    { razorpayOrderId: order.id, paymentStatus: 'pending', amount: amount / 100 },
    { upsert: true }
  );

  res.json({ orderId: order.id, amount, currency: 'INR', trackTitle: track.title });
};

export const verifyPayment = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, trackId } = req.body;

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expected !== razorpaySignature)
    return res.status(400).json({ message: 'Payment verification failed' });

  const enrollment = await Enrollment.findOneAndUpdate(
    { razorpayOrderId },
    { razorpayPaymentId, paymentStatus: 'paid' },
    { new: true }
  ).populate('track');

  const track = await enrollment.populate('track');
  await sendEnrollmentConfirmation({
    to:          req.user.email,
    name:        req.user.name,
    trackTitle:  enrollment.track.title,
    companyName: 'the company',
  });

  res.json({ message: 'Payment verified', enrollment });
};

export const enrollFree = async (req, res) => {
  const { trackId } = req.body;
  const track = await Track.findById(trackId);
  if (!track) return res.status(404).json({ message: 'Track not found' });
  if (track.isPremium) return res.status(403).json({ message: 'This track requires payment' });

  const enrollment = await Enrollment.findOneAndUpdate(
    { user: req.user._id, track: trackId },
    { paymentStatus: 'free' },
    { upsert: true, new: true }
  );

  res.status(201).json(enrollment);
};