import crypto from 'crypto';
import { getRazorpay } from '../utils/razorpay.js';
import Enrollment from '../models/Enrollment.js';
import Track from '../models/Track.js';
import { sendEnrollmentConfirmation } from '../utils/mailer.js';

export const createOrder = async (req, res) => {
  try {
    const { trackId } = req.body
    if (!trackId) return res.status(400).json({ message: 'trackId is required' })

    const track = await Track.findById(trackId).populate('company', 'name')
    if (!track) return res.status(404).json({ message: 'Track not found' })

    // Create razorpay instance here so env is already loaded
    const razorpay = getRazorpay()

    console.log('Razorpay Key:', process.env.RAZORPAY_KEY_ID)

    const amount = 49900

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
    })

    await Enrollment.findOneAndUpdate(
      { user: req.user._id, track: trackId },
      { razorpayOrderId: order.id, paymentStatus: 'pending', amount: amount / 100 },
      { upsert: true }
    )

    res.json({
      orderId:    order.id,
      amount:     order.amount,
      currency:   order.currency,
      trackTitle: track.title,
    })
  } catch (err) {
    console.error('Razorpay error:', err.message)
    res.status(500).json({ message: err.message })
  }
}
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