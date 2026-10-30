// Pad data contract for HW1 Drum Kit.
// Each pad: { id, code, key, label, src }
// - code: physical key from KeyboardEvent.code (IME-safe, never keyCode)
// - key:  letter shown on screen inside <kbd>
export const PADS = [
  { id: 'kick',  code: 'KeyW', key: 'W', label: 'Kick',   src: '/sounds/kick.wav' },
  { id: 'snare', code: 'KeyA', key: 'A', label: 'Snare',  src: '/sounds/snare.wav' },
  { id: 'hihat', code: 'KeyS', key: 'S', label: 'Hi-Hat', src: '/sounds/hihat.wav' },
  { id: 'clap',  code: 'KeyD', key: 'D', label: 'Clap',   src: '/sounds/clap.wav' },
  { id: 'tom',   code: 'KeyJ', key: 'J', label: 'Tom',    src: '/sounds/tom.wav' },
  { id: 'ride',  code: 'KeyK', key: 'K', label: 'Ride',   src: '/sounds/ride.wav' },
  { id: 'crash', code: 'KeyL', key: 'L', label: 'Crash',  src: '/sounds/crash.wav' },
];

// Lookup table: KeyboardEvent.code -> pad.
// Built once at module level so its reference never changes between renders
// (safe to use as a useEffect dependency).
export const PAD_BY_CODE = new Map(PADS.map((pad) => [pad.code, pad]));