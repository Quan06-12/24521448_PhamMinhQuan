import mongoose from 'mongoose';
import { Dossier } from './models/Dossier.js';
import { Appeal } from './models/Appeal.js';
import { DOSSIERS } from './data/dossiers.js';

// One-off script: reset dossiers and appeals with the fictional case-study data
const { MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error('MONGODB_URI missing – copy .env.example to .env');

try {
  await mongoose.connect(MONGODB_URI);
  const appeals = await Appeal.deleteMany({});
  const dossiers = await Dossier.deleteMany({});
  const created = await Dossier.insertMany(DOSSIERS);
  console.log(`Seed done: removed ${dossiers.deletedCount} dossiers + ${appeals.deletedCount} appeals, inserted ${created.length} dossiers`);
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}