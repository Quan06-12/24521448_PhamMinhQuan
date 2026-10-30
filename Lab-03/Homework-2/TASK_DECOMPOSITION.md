# Homework 2 — work breakdown

- [ ] Generate 88 keys (A0–C8) algorithmically: `f = 440 * 2^((midi - 69) / 12)`.
- [ ] Implement `PolyphonicSynth` (8 voices, FIFO stealing via Map, click-free release).
- [ ] Build memoized `PianoKey` (`React.memo`) + stable callbacks (`useCallback`).
- [ ] Add FIFO recorder and replay at 0.5x / 1x / 2x with AbortController stop.
- [ ] Verify in Profiler: one key press re-renders only one key.
- [ ] Record observed AI bugs in `AI_FAILURE_AUDIT.md`.
