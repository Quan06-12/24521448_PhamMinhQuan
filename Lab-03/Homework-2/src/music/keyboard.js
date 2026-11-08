// 88-key layout, built once from MIDI maths (no hand-written key list)
export const FIRST_MIDI = 21;  // A0
export const LAST_MIDI = 108;  // C8
export const MIDDLE_C = 60;    // C4

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SPOKEN_NAMES = ['C', 'C sharp', 'D', 'D sharp', 'E', 'F', 'F sharp', 'G', 'G sharp', 'A', 'A sharp', 'B'];
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

// Equal temperament, A4 (MIDI 69) = 440 Hz
export function midiToFreq(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

// MIDI 60 -> "C4" (octave number = floor(midi / 12) - 1)
function midiToName(midi) {
  return `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

// Name for screen readers, "#" is read badly so spell it out
export function midiToSpokenName(midi) {
  return `${SPOKEN_NAMES[midi % 12]} ${Math.floor(midi / 12) - 1}`;
}

function buildKeys() {
  const keys = [];
  let whiteCount = 0;
  for (let midi = FIRST_MIDI; midi <= LAST_MIDI; midi += 1) {
    const isBlack = BLACK_PITCH_CLASSES.has(midi % 12);
    // A black key sits on the border after the white key before it,
    // so it reuses that white key's index (whiteCount - 1)
    const whiteIndex = isBlack ? whiteCount - 1 : whiteCount;
    if (!isBlack) whiteCount += 1;
    keys.push(
      Object.freeze({
        midi,
        noteName: midiToName(midi),
        isBlack,
        freqHz: midiToFreq(midi),
        whiteIndex,
      }),
    );
  }
  return Object.freeze(keys);
}

export const KEYS = buildKeys();
export const KEY_BY_MIDI = new Map(KEYS.map((key) => [key.midi, key]));
export const WHITE_KEY_COUNT = KEYS.filter((key) => !key.isBlack).length;
export const BLACK_KEY_COUNT = KEYS.length - WHITE_KEY_COUNT;

// Fail loudly at import time if the maths is ever broken
if (KEYS.length !== 88 || WHITE_KEY_COUNT !== 52 || BLACK_KEY_COUNT !== 36) {
  throw new Error(`Bad keyboard layout: ${KEYS.length} / ${WHITE_KEY_COUNT} / ${BLACK_KEY_COUNT}`);
}

// Computer keyboard -> MIDI for one octave (C4..C5), by physical key position
export const SHORTCUT_BY_CODE = new Map([
  ['KeyA', 60], ['KeyW', 61], ['KeyS', 62], ['KeyE', 63], ['KeyD', 64],
  ['KeyF', 65], ['KeyT', 66], ['KeyG', 67], ['KeyY', 68], ['KeyH', 69],
  ['KeyU', 70], ['KeyJ', 71], ['KeyK', 72],
]);

// midi -> letter shown on the key ("KeyA" -> "A")
export const SHORTCUT_LABEL_BY_MIDI = new Map(
  [...SHORTCUT_BY_CODE].map(([code, midi]) => [midi, code.slice(3)]),
);
