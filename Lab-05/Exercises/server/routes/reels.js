import { Router } from 'express';
import { EvidenceReel } from '../models/EvidenceReel.js';

const router = Router();

router.get('/api/v2/reels', async (_req, res) => {
  const reels = await EvidenceReel.find().sort({ createdAt: -1 }).lean();
  res.status(200).json(reels);
});

router.patch('/api/v2/reels/:id/endorse', async (req, res) => {
  const updated = await EvidenceReel.findByIdAndUpdate(
    req.params.id,
    { $inc: { endorsements: 1 } },
    { new: true, runValidators: true }
  );

  if (!updated) {
    return res.status(404).json({ error: 'Reel not found' });
  }
  res.status(200).json(updated);
});

export default router;