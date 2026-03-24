import dotenv from "dotenv";
dotenv.config();

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    // 1. Check if user already exists with googleId
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      return done(null, user);
    }

    // 2. Check if user exists with same email
    user = await User.findOne({ email });

    if (user) {
      // 🔗 Link Google account
      user.googleId = profile.id;
      await user.save();
      return done(null, user);
    }

    // 3. Create new user
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: email,
      avatar: profile.photos[0].value,
    });

    return done(null, user);

  } catch (err) {
    return done(err, null);
  }
}));