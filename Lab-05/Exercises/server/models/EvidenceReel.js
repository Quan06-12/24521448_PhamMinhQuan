import mongoose from 'mongoose';

const evidenceReelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    playerTag: { type: String, required: true, enum: ['Himass', 'TanVuu'] },
    videoUrl: { type: String, required: true },
    fps: { type: Number, required: true, default: 60 },
    verticalRecoilDeg: { type: Number, required: true },
    endorsements: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

evidenceReelSchema.index({ createdAt: -1, endorsements: -1 });

export const EvidenceReel = mongoose.model('EvidenceReel', evidenceReelSchema);