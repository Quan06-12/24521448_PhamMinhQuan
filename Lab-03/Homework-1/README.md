# Homework 1 — Production Studio Drum Kit

React 19 + Vite drum kit modernizing the legacy Lab 3 slide 26 exercise
with physical key codes, accessible pads and a visual hit log for deaf and
hard-of-hearing users.

## Scope

- 7 pads mapped to physical keys `W A S D J K L` via `KeyboardEvent.code`
  (works with Vietnamese IME such as UniKey; `keyCode` is never used).
- Anti-repeat guard (`e.repeat`), modifier-key pass-through (Ctrl/Alt/Meta
  shortcuts stay with the browser) and typing-field isolation.
- Polyphonic playback: each hit clones a preloaded sample so fast hits overlap.
- Pads are native `<button type="button">` with `aria-pressed` flash state.
- Visual hit log (10 newest) with an `aria-live="polite"` `<output>` that
  announces only the latest hit, plus a native `<meter>` burst level.
- CSS Modules + custom properties, 3-column pad grid at 375px,
  `:focus-visible` outline and `prefers-reduced-motion` support.

## Run locally

```sh
npm install
npm run dev        # development: http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the build: http://localhost:4173
```

## Architecture

| File | Responsibility |
|---|---|
| `src/pads.js` | Pad data contract + `PAD_BY_CODE` / `PAD_BY_ID` lookup maps (module constants, stable references) |
| `src/hooks/useDrumKeyboard.js` | One `window` keydown listener with guards and cleanup |
| `src/hooks/useDrumAudio.js` | Preloads samples in an effect, exposes stable `playPad`, releases audio on unmount |
| `src/components/DrumPad.jsx` | Pad button; flash timer restarts on each hit token and is cleared on cleanup |
| `src/components/HitLog.jsx` | Hit history, live announcement and derived burst meter (no `useEffect`) |
| `src/App.jsx` | Owns state (`hitTokens`, `hits`) and the single `handleTrigger` entry point |

## Verification status

| Check | Result | Evidence |
|---|---|---|
| Keys W A S D J K L trigger the right pad | Pass | Console log during development |
| Holding a key fires once (`e.repeat`) | Pass | Console log |
| UniKey (Vietnamese IME) on | Pass | Manual test |
| Ctrl+S does not trigger a pad | Pass | Manual test |
| Exactly 1 `keydown` listener on `window` (StrictMode) | Pass | DevTools Event Listeners screenshot (Word report) |
| 375px: 3-column grid, no horizontal scroll | Pass | DevTools device toolbar screenshot (Word report) |
| Lighthouse (mobile, production build, incognito) | Performance 99–100 (2 runs), Accessibility 100, Best Practices 100, SEO 100 | Lighthouse screenshot (Word report) |

## Known limitations

- The burst meter updates only when a new hit arrives; it does not decay to 0
  while idle, because it is derived purely from the hit log (no timer).
- The first hit may be silent if the browser blocks audio before any user
  interaction; the rejection is caught and logged as a warning.
- Screen-reader speech (NVDA / Narrator) and a physical mobile device were not
  tested; the 375px check used Chrome DevTools device emulation only.