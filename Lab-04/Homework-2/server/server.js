import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Profile } from './models/Profile.js';

// 1. Environment variable guard: fail fast instead of connecting to a hardcoded URI
const { MONGODB_URI, PORT = 3002, CLIENT_ORIGIN = 'http://localhost:5173' } = process.env;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI missing – copy .env.example to .env');
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

// Health check: shows whether the database connection is up
app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// 3. GET /api/profiles: async/await read, .lean() returns plain objects (faster, JSON-ready)
app.get('/api/profiles', async (req, res, next) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: 1 }).lean();
    res.json(profiles);
  } catch (err) {
    next(err);
  }
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler: JSON response, never an HTML stack trace
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.type === 'entity.parse.failed' ? 400 : err.status || 500;
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${status}: ${err.message}`);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
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