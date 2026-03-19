import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import './config/passport.js';

import authRoutes        from './routes/auth.routes.js';
import companyRoutes     from './routes/company.routes.js';
import trackRoutes       from './routes/track.routes.js';
import lessonRoutes      from './routes/lesson.routes.js';
import questionRoutes    from './routes/question.routes.js';
import testRoutes        from './routes/test.routes.js';
import scoreRoutes       from './routes/score.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';
import enrollRoutes      from './routes/enrollment.routes.js';
import paymentRoutes     from './routes/payment.routes.js';
import adminRoutes       from './routes/admin.routes.js';
import progressRoutes    from './routes/progress.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth',        authRoutes);
app.use('/api/companies',   companyRoutes);
app.use('/api/tracks',      trackRoutes);
app.use('/api/lessons',     lessonRoutes);
app.use('/api/questions',   questionRoutes);
app.use('/api/tests',       testRoutes);
app.use('/api/scores',      scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/enrollments', enrollRoutes);
app.use('/api/payments',    paymentRoutes);
app.use('/api/admin',       adminRoutes);
app.use('/api/progress',    progressRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000,
    () => console.log(`PlacePrep server on port ${process.env.PORT || 5000}`)))
  .catch(err => console.error('DB connection failed:', err));