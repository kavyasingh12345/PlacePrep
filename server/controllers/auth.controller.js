import User from '../models/User.js';
import { generateToken, cookieOptions } from '../utils/generateToken.js';
import { sendWelcome } from '../utils/mailer.js';

export const register = async (req, res) => {
  const { name, email, password, branch, college, gradYear } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({
    name, email, passwordHash: password, branch, college, gradYear,
  });

  await sendWelcome({ to: email, name });
  const token = generateToken(user._id);
  res.cookie('token', token, cookieOptions);
  res.status(201).json({ user: user.toPublic() });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });

  const token = generateToken(user._id);
  res.cookie('token', token, cookieOptions);
  res.json({ user: user.toPublic() });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  res.cookie('token', token, cookieOptions);
  res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};

export const getMe = (req, res) => res.json(req.user);

export const updateProfile = async (req, res) => {
  const { name, branch, college, gradYear } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, branch, college, gradYear },
    { new: true }
  ).select('-passwordHash');
  res.json(user);
};