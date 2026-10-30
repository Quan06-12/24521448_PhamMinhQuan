# Homework 1 — work breakdown

Each slice follows contract → isolated implementation → DevTools verification → commit.
Browser evidence belongs in ignored `evidence/`, never in Git.

- [x] Scaffold React 19 Vite app (`createRoot` + `StrictMode`) — `1e3fe13`
- [x] Define pad contract and `e.code` lookup map (W A S D J K L) — `4cdab06`
- [x] Implement `useDrumKeyboard` (`e.code`, `e.repeat`, modifier and input isolation, cleanup) — `4cb381a`
- [x] Implement polyphonic sample playback with effect cleanup — `2afb219`
- [x] Build `<DrumPad>` buttons with `aria-pressed` flash state — `fd3a55a`
- [x] Add `aria-live` hit log `<output>` and derived `<meter>` — `6057410`
- [x] Responsive 375px CSS Module layout and focus styles — `7d2b386`
- [x] Lighthouse mobile: Performance 99–100, Accessibility 100, Best Practices 100, SEO 100 — `5ca13e7`
- [x] Record observed AI bugs in `AI_FAILURE_AUDIT.md` (3 entries)
- [ ] Verify screen-reader speech (NVDA / Narrator)
- [ ] Test on a physical mobile device