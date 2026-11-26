import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Profile } from './models/Profile.js';
import { Swipe, DIRECTIONS } from './models/Swipe.js';

// 1. Environment variable guard: fail fast instead of connecting to a hardcoded URI
const { MONGODB_URI, PORT = 3002, CLIENT_ORIGIN = 'http://localhost:5173' } = process.env;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI missing – copy .env.example to .env');
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

const isObjectId = (value) => typeof value === 'string' && mongoose.isValidObjectId(value);

// Health check: shows whether the database connection is up
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// GET /api/profiles: .lean() returns plain objects (faster, JSON-ready)
app.get('/api/profiles', async (req, res, next) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: 1 }).lean();
    res.json(profiles);
  } catch (err) {
    next(err);
  }
});

// GET /api/swipes: full history in swipe order, so a page reload restores progress and score
app.get('/api/swipes', async (req, res, next) => {
  try {
    const swipes = await Swipe.find().sort({ createdAt: 1 }).lean();
    res.json(swipes);
  } catch (err) {
    next(err);
  }
});

// POST /api/swipes: validate the payload before touching the database
app.post('/api/swipes', async (req, res, next) => {
  try {
    const { profileId, direction } = req.body ?? {};
    if (!profileId || !direction) {
      return res.status(400).json({ error: 'Missing required fields: profileId and direction' });
    }
    if (!DIRECTIONS.includes(direction)) {
      return res.status(400).json({ error: `direction must be one of: ${DIRECTIONS.join(', ')}` });
    }
    if (!isObjectId(profileId)) {
      return res.status(400).json({ error: 'profileId is not a valid id' });
    }
    if (!(await Profile.exists({ _id: profileId }))) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    // Only whitelisted fields reach the model (no mass assignment from req.body)
    const swipe = await Swipe.create({ profileId, direction });
    res.status(201).json(swipe);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/swipes/:id: undo one swipe (the client pops its LIFO stack and sends the id)
app.delete('/api/swipes/:id', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Swipe id is not a valid id' });
    }
    const deleted = await Swipe.findByIdAndDelete(req.params.id).lean();
    if (!deleted) {
      return res.status(404).json({ error: 'Swipe not found' });
    }
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/swipes: reset the whole history ("start over")
app.delete('/api/swipes', async (req, res, next) => {
  try {
    const { deletedCount } = await Swipe.deleteMany({});
    res.json({ deletedCount });
  } catch (err) {
    next(err);
  }
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler: map known errors to 4xx, never send an HTML stack trace
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  let message = err.message;
  if (err.type === 'entity.parse.failed') status = 400; // malformed JSON body
  if (err.name === 'ValidationError' || err.name === 'CastError') status = 400; // schema rules
  if (err.code === 11000) {
    status = 409; // unique index on profileId
    message = 'This profile has already been swiped';
  }
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${status}: ${err.message}`);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : message });
});

// 2. Modern connection: no deprecated useNewUrlParser / useUnifiedTopology flags (removed in Mongoose 8)
try {
  await mongoose.connect(MONGODB_URI);
  const { version } = await mongoose.connection.db.admin().buildInfo();
  console.log(`MongoDB ${version} connected (mongoose ${mongoose.version}), db "${mongoose.connection.name}"`);
  app.listen(PORT, () => console.log(`Swipe API on http://localhost:${PORT}`));
} catch (err) {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
}