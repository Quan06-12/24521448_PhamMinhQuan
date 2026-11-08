# Homework 2 — work breakdown

- [x] Scaffold React 19 Vite app — `c1e8b0c`
- [x] Generate 88 keys (A0–C8) algorithmically: `f = 440 * 2^((midi - 69) / 12)` — `d71b108`
- [x] Implement `PolyphonicSynth` (8 voices, FIFO stealing via Map, click-free release) — `c445f57`
- [x] Build memoized `PianoKey` (`React.memo`) + stable callbacks (`useCallback`) — `e0c46be`
- [x] Add FIFO recorder and replay at 0.5x / 1x / 2x with AbortController stop — `e671626`
- [x] Responsive layout with CSS Modules; keyboard scrolls inside its own region — `f56b151`
- [x] Verify one key press re-renders only one key — render counter, kept out of production in `dffbe49`
- [x] Record observed AI bugs in `AI_FAILURE_AUDIT.md`
- [ ] Verify with a screen reader (NVDA / Narrator)
- [ ] Test on a physical mobile device
