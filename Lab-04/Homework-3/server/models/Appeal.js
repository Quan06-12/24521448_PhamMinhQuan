import { Schema, model } from 'mongoose';

export const OUTCOMES = ['overturn', 'reduce', 'review'];

// An appeal against one incident. The server owns filedAt and slaDeadline (absolute times),
// so every client counts down to the same instant, whatever its own clock drift or reloads.
const appealSchema = new Schema(
  {
    playerId: { type: String, required: true, lowercase: true, trim: true },
    incidentCode: { type: String, required: true },
    appellant: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    outcome: { type: String, required: true, enum: OUTCOMES },
    grounds: { type: String, required: true, trim: true, minlength: 50, maxlength: 1000 },
    filedAt: { type: Date, required: true },
    slaDeadline: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'decided'], default: 'pending' },
  },
  { timestamps: true }
);

export const Appeal = model('Appeal', appealSchema);