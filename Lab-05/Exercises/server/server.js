import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import reelsRouter from './routes/reels.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(reelsRouter);

// Express 5 global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

await mongoose.connect(process.env.MONGODB_URI);
console.log('MongoDB connected (Mongoose 8)');

app.listen(PORT, () => {
  console.log(`Lab 5 Server listening on http://localhost:${PORT}`);
});