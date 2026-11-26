import { Schema, model } from 'mongoose';

export const DIRECTIONS = ['left', 'right', 'up']; // nope, like, super like

// One swipe per profile: undo deletes the record so the card can be swiped again
const swipeSchema = new Schema(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true, unique: true },
    direction: { type: String, enum: DIRECTIONS, required: true },
  },
  { timestamps: true }
);

export const Swipe = model('Swipe', swipeSchema);