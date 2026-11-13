import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT) || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
// Artificial latency so request cancellation is easy to observe in DevTools
const LATENCY_MS = Number(process.env.LATENCY_MS ?? 800);
const MAX_TEXT_LENGTH = 500;

const app = express();

// Only the Vite dev origin may call this API
app.use(cors({ origin: CLIENT_ORIGIN }));
// Parse JSON bodies; reject oversized payloads
app.use(express.json({ limit: '10kb' }));

// In-memory store, keyed by forum id (resets on server restart)
const forums = {
  nasa: [
    { id: randomUUID(), author: 'Mission Control', text: 'Artemis telemetry nominal.', timestamp: new Date().toISOString() },
  ],
  'esports-tribunal': [
    { id: randomUUID(), author: 'Referee', text: 'Appeal window opens at 20:00.', timestamp: new Date().toISOString() },
  ],
  notNasa: [
    { id: randomUUID(), author: 'Skeptic', text: 'Definitely not a space agency.', timestamp: new Date().toISOString() },
  ],
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Shared guard: unknown forum ids get a 404 instead of an empty list
function requireForum(req, res, next) {
  if (!Object.hasOwn(forums, req.params.forum)) {
    return res.status(404).json({ error: `Unknown forum "${req.params.forum}"` });
  }
  next();
}

// GET /api/messages/:forum -> list messages of one channel
app.get('/api/messages/:forum', requireForum, async (req, res) => {
  await wait(LATENCY_MS);
  res.json(forums[req.params.forum]);
});

// POST /api/messages/:forum -> validate payload, then create a message
app.post('/api/messages/:forum', requireForum, (req, res) => {
  const author = typeof req.body?.author === 'string' ? req.body.author.trim() : '';
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';

  if (!author || !text) {
    return res.status(400).json({ error: 'Missing required fields: author and text' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `Text must be at most ${MAX_TEXT_LENGTH} characters` });
  }

  // Server owns id and timestamp; client-sent values are ignored
  const message = { id: randomUUID(), author, text, timestamp: new Date().toISOString() };
  forums[req.params.forum].push(message);
  res.status(201).json(message);
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Malformed JSON and unexpected errors return JSON, never an HTML stack trace
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.type === 'entity.parse.failed' ? 400 : err.status || 500;
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${status}: ${err.message}`);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
});

app.listen(PORT, () => {
  console.log(`Forum API listening on http://localhost:${PORT} (CORS origin: ${CLIENT_ORIGIN})`);
});
