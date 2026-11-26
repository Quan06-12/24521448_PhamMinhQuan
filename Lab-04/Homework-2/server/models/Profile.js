import { Schema, model } from 'mongoose';

// Fictional dating profile shown as one card in the deck
const profileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    age: { type: Number, required: true, min: 18, max: 99 },
    city: { type: String, required: true, trim: true },
    bio: { type: String, required: true, maxlength: 200 },
    tags: { type: [String], default: [] },
    redFlag: { type: String, default: '' },
    avatar: { type: String, required: true }, // emoji, no real photos
    accent: { type: String, default: '#22d3ee' }, // card accent colour
  },
  { timestamps: true }
);

export const Profile = model('Profile', profileSchema);