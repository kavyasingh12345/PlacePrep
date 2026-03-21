import User from '../models/User.js';
import { generateToken, cookieOptions } from '../utils/generateToken.js';
import { sendWelcome } from '../utils/mailer.js';
// register working
export const register = async (req, res) => {
  const { name, email, password, branch, college, gradYear, role } = req.body
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already registered' })

  const user = await User.create({
    name, email, passwordHash: password,
    branch, college, gradYear,
    role: role || 'student',   // ← make sure role is saved
  })

  const token = generateToken(user._id)
  res.cookie('token', token, cookieOptions)
  res.status(201).json({
    user: {
      id:    user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,        // ← explicitly include role
      branch: user.branch,
      college: user.college,
      gradYear: user.gradYear,
      avatar: user.avatar,
    }
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' })

  const token = generateToken(user._id)
  res.cookie('token', token, cookieOptions)
  res.json({
    user: {
      id:      user._id,
      name:    user.name,
      email:   user.email,
      role:    user.role,      // ← explicitly include role
      branch:  user.branch,
      college: user.college,
      gradYear: user.gradYear,
      avatar:  user.avatar,
    }
  })
}
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