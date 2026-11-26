import mongoose from 'mongoose';
import { Profile } from './models/Profile.js';
import { Swipe } from './models/Swipe.js';
import { PROFILES } from './data/profiles.js';

// One-off script: reset profiles and swipe history with the seed data
const { MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error('MONGODB_URI missing – copy .env.example to .env');

try {
  await mongoose.connect(MONGODB_URI);
  // Old swipes point at old profile ids, so clear them together
  const swipes = await Swipe.deleteMany({});
  const profiles = await Profile.deleteMany({});
  const created = await Profile.insertMany(PROFILES);
  console.log(`Seed done: removed ${profiles.deletedCount} profiles + ${swipes.deletedCount} swipes, inserted ${created.length} profiles`);
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  // Always close the connection so the script exits
  await mongoose.disconnect();
}