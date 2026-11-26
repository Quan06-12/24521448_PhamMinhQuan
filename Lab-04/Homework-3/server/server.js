import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Dossier } from './models/Dossier.js';
import { Appeal, OUTCOMES } from './models/Appeal.js';

// Environment guard: fail fast, never fall back to a hardcoded URI
const { MONGODB_URI, PORT = 3003, CLIENT_ORIGIN = 'http://localhost:5173', SLA_MINUTES = '30' } = process.env;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI missing – copy .env.example to .env');
}
const SLA_MS = Number(SLA_MINUTES) * 60_000;

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// GET /api/dossiers: list for the home page (no incident details)
app.get('/api/dossiers', async (req, res, next) => {
  try {
    const dossiers = await Dossier.find({}, { playerId: 1, handle: 1, team: 1, game: 1, region: 1 })
      .sort({ handle: 1 })
      .lean();
    res.json(dossiers);
  } catch (err) {
    next(err);
  }
});

// GET /api/dossiers/:playerId: full dossier plus its appeals (newest first)
app.get('/api/dossiers/:playerId', async (req, res, next) => {
  try {
    const playerId = req.params.playerId.toLowerCase();
    const dossier = await Dossier.findOne({ playerId }).lean();
    if (!dossier) {
      return res.status(404).json({ error: `No dossier for player "${req.params.playerId}"` });
    }
    const appeals = await Appeal.find({ playerId }).sort({ filedAt: -1 }).lean();
    // serverNow lets the client measure its own clock offset against the server
    res.json({ dossier, appeals, serverNow: Date.now() });
  } catch (err) {
    next(err);
  }
});

// POST /api/appeals: mirror of the client validation; the server sets filedAt and slaDeadline
app.post('/api/appeals', async (req, res, next) => {
  try {
    const { playerId, incidentCode, appellant, email, outcome, grounds } = req.body ?? {};
    const missing = ['playerId', 'incidentCode', 'appellant', 'email', 'outcome', 'grounds'].filter(
      (key) => typeof req.body?.[key] !== 'string' || !req.body[key].trim()
    );
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }
    if (!EMAIL.test(email.trim())) return res.status(400).json({ error: 'email is not valid' });
    if (!OUTCOMES.includes(outcome)) return res.status(400).json({ error: `outcome must be one of: ${OUTCOMES.join(', ')}` });
    if (grounds.trim().length < 50) return res.status(400).json({ error: 'grounds must be at least 50 characters' });

    const dossier = await Dossier.findOne({ playerId: playerId.toLowerCase() }).lean();
    if (!dossier) return res.status(404).json({ error: 'Dossier not found' });
    if (!dossier.incidents.some((i) => i.code === incidentCode)) {
      return res.status(400).json({ error: `Incident ${incidentCode} is not in this dossier` });
    }
    // One open appeal per incident
    const open = await Appeal.exists({ playerId: dossier.playerId, incidentCode, status: 'pending' });
    if (open) return res.status(409).json({ error: `Incident ${incidentCode} already has a pending appeal` });

    const filedAt = new Date();
    const appeal = await Appeal.create({
      playerId: dossier.playerId,
      incidentCode,
      appellant,
      email,
      outcome,
      grounds,
      filedAt,
      slaDeadline: new Date(filedAt.getTime() + SLA_MS),
    });
    res.status(201).json({ appeal, serverNow: Date.now() });
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central JSON error handler
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  if (err.type === 'entity.parse.failed') status = 400;
  if (err.name === 'ValidationError' || err.name === 'CastError') status = 400;
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${status}: ${err.message}`);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
});

try {
  await mongoose.connect(MONGODB_URI);
  const { version } = await mongoose.connection.db.admin().buildInfo();
  console.log(`MongoDB ${version} connected (mongoose ${mongoose.version}), db "${mongoose.connection.name}"`);
  app.listen(PORT, () => console.log(`Tribunal API on http://localhost:${PORT} (SLA ${SLA_MINUTES} min)`));
} catch (err) {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
}