# Exercise 3 — KRAFTON PUBG VN Live Match Telemetry

React 19 live radar for PUBG Vietnam Series squads (slides 20–23):
Cerberus Esports (CES), The Expendables (TE) and Genius Esports (GE).

## Scope

- 4-state machine `IDLE | LOADING | SUCCESS | ERROR` in one `view` object (no boolean soup).
- Real `fetch` of `/telemetry/<id>.json` plus a 1.2s abortable radar delay and a
  simulated 35% packet loss.
- `AbortController` created per effect run; cleanup aborts the stale request on squad
  switch, retry, unmount and the StrictMode re-run. `AbortError` never shows an error.
- The component is rendered with `key={squadId}`, so a new squad starts from `LOADING`
  without calling setState in the effect body.
- Skeleton bars (`aria-hidden`, `prefers-reduced-motion` aware) and `aria-busy` while loading.
- Errors render in `<section role="alert">` with a "Reconnect Satellite (Retry)" button;
  focus moves to the persistent radar frame before the button disappears.
- Every state shares one frame with `min-height: 280px`, so switching states does not shift layout.
- CSS Modules; CES / TE / GE fit on one row at 375px.

## Design note: the slide reference code fails this project's ESLint

Slides 21 and 23 call `setView({ status: 'LOADING' })` synchronously inside `useEffect`.
With `eslint-plugin-react-hooks` 7.1.1 (the Vite template default) this is an error,
`react-hooks/set-state-in-effect`, because it forces an extra render. This exercise
resets state with `key={squadId}` instead and sets `LOADING` for Retry inside the click handler.

## Run locally

```sh
npm install
npm run dev
```

## Verification (Checkpoint 3)

| Check | Result |
|---|---|
| Network 3G, click CES → TE → GE quickly: earlier `*.json` requests show `(canceled)`, only GE renders | Pass |
| 3G: skeleton bars + "Syncing KRAFTON radar…" while loading | Pass |
| Error state shows `role="alert"` and a Retry button | Pass |
| Keyboard Retry keeps focus on the radar frame (not `<body>`) | Pass |
| Radar frame is 280px in LOADING and SUCCESS at 375px (no layout shift) | Pass |
| `npx eslint src` | 0 problems |
| Banned-API grep (`window.alert`, `keyCode`, `defaultProps`, …) | 0 matches |

Screenshots are included in the submitted Word report.