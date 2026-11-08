# Homework 2 — 88-Key Polyphonic Piano & FIFO Sequencer

React 19 + Vite piano that combines legacy slide 27's 88-key keyboard with
`React.memo` render isolation and a FIFO note queue for recording and replay.

## Scope

- 88 keys generated from MIDI 21 (A0) to 108 (C8): 52 white, 36 black,
  `f = 440 * 2 ** ((midi - 69) / 12)`. No hardcoded key tags.
- `PolyphonicSynth` (Web Audio): up to 8 oscillator voices in an ES6 `Map`;
  the 9th note releases the oldest voice first (insertion order = FIFO).
- Click-free release: `exponentialRampToValueAtTime(0.0001, t + 0.04)` before `osc.stop()`.
- `PianoKey` is wrapped in `memo`; note handlers are stable `useCallback`s with
  functional updates, so pressing one key re-renders only that key.
- Pointer, Enter/Space on a focused key, and computer keys
  `A W S E D F T G Y H U J K` (via `KeyboardEvent.code`) for C4–C5.
- FIFO recorder stores `{ midi, freqHz, durationMs, deltaMs }`; replay at
  0.5x / 1x / 2x with an abortable sleep. "Stop Sequence" aborts playback and
  silences every voice; unmount does the same.
- The keyboard scrolls inside its own region, so the page has no horizontal
  scroll at 375px; middle C is scrolled into view on load.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build
```

## Architecture

| File | Responsibility |
|---|---|
| `src/music/keyboard.js` | Builds the frozen 88-key table (note name, black/white, frequency, white index) |
| `src/audio/PolyphonicSynth.js` | Voice pool, FIFO stealing, click-free release, voice-count subscription |
| `src/audio/sequencer.js` | Recording helpers and the abortable replay loop |
| `src/hooks/useKeyboardShortcuts.js` | One `keydown`/`keyup` pair on `window` with repeat, modifier and input guards |
| `src/hooks/useSequencer.js` | Record / play / stop state and AbortController lifecycle |
| `src/components/PianoKey.jsx` | Memoized key button with `aria-pressed` |
| `src/components/Piano.jsx` | Pressed-note `Set`, stable handlers, scrollable keyboard region |
| `src/components/Sequencer.jsx` | Record, speed select, play, stop, recorded note list, live status |

## Verification status

| Check | Result |
|---|---|
| Key table | 88 keys, 52 white, 36 black; A0 = 27.5 Hz, A4 = 440 Hz, C8 ≈ 4186.01 Hz |
| One key press re-renders only that key | Pass (per-key render counter in development) |
| C major chord | "Voices 3 / 8" |
| Nine keys held | "Voices 8 / 8"; the first-held note is released (FIFO) |
| Replay timing | 6 notes: 1734 ms at 1x, 869 ms at 2x |
| Stop Sequence mid-replay | Status "Stopped", 0 voices, no key left pressed |
| Holding Space on a focused key | One note, repeats ignored |
| 375 x 667 | Page `scrollWidth` 375; keyboard region scrolls; C4 visible on load |
| `npx eslint src` / `npx vite build` | 0 problems / success |
| Console errors | None |

Screenshots are included in the submitted Word report.
