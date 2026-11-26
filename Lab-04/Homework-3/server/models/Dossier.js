import { Schema, model } from 'mongoose';

// One sanctioned incident inside a player's dossier
const incidentSchema = new Schema(
  {
    code: { type: String, required: true }, // e.g. "INC-01", unique within the dossier
    date: { type: String, required: true }, // ISO date (YYYY-MM-DD)
    match: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: Number, required: true, min: 1, max: 5 }, // tribunal scale 1 (minor) – 5 (critical)
    matchesBanned: { type: Number, required: true, min: 0 },
    fine: { type: Number, required: true, min: 0 }, // USD
  },
  { _id: false }
);

// Fictional case-study dossier, addressed by a URL-friendly slug (/dossier/:playerId)
const dossierSchema = new Schema(
  {
    playerId: { type: String, required: true, unique: true, lowercase: true, trim: true },
    handle: { type: String, required: true },
    team: { type: String, required: true },
    game: { type: String, required: true },
    region: { type: String, required: true },
    summary: { type: String, required: true },
    incidents: { type: [incidentSchema], default: [] },
  },
  { timestamps: true }
);

export const Dossier = model('Dossier', dossierSchema);