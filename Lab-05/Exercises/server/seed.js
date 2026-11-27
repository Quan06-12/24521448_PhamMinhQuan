import mongoose from 'mongoose';
import { EvidenceReel } from './models/EvidenceReel.js';

await mongoose.connect(process.env.MONGODB_URI);

await EvidenceReel.deleteMany({});
await EvidenceReel.insertMany([
  {
    title: 'Himass PGS Handcam POV #1',
    playerTag: 'Himass',
    videoUrl: '/videos/sample-1.mp4',
    fps: 60,
    verticalRecoilDeg: 13.8,
  },
  {
    title: 'TanVuu Spray Telemetry #2',
    playerTag: 'TanVuu',
    videoUrl: '/videos/sample-2.mp4',
    fps: 60,
    verticalRecoilDeg: 14.2,
  },
  {
    title: 'Himass Close-Range Flick #3',
    playerTag: 'Himass',
    videoUrl: '/videos/sample-3.mp4',
    fps: 59.8,
    verticalRecoilDeg: 13.5,
  },
]);

console.log('Seeded 3 EvidenceReels');
await mongoose.disconnect();