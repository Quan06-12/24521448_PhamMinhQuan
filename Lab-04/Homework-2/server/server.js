import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

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