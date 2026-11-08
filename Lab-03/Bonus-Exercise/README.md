# Bonus Exercise — "Hẹn Hò Nhưng Không Yêu" State Machine

React 19 + Vite `<SituationshipAnalyzer />`: a V-pop themed exercise that replaces
"situationship" boolean soup (`isDating && !isLoved && !hasTitle`) with one finite
state machine, derived effort scores and a leak-free ghosting timer.

## Scope

- Phases `FRIENDS | DATING_NO_LOVE | OFFICIAL_LOVE | GHOSTED_EXIT` in a pure
  `useReducer` with an explicit transition table; actions not allowed in the current
  phase are ignored, and the same guard disables the matching buttons.
- Asymmetric effort: an immutable signal log `{ id, actor: 'EM' | 'AI_DO', steps, multiplier }`
  (Em × 0.1, Ai Đó × 50). Scores, ratio, share and the red flag are derived during render.
- "Seen không rep" timer: sending a message in DATING_NO_LOVE starts a 5 s reply window
  with a visible countdown. Reply cancels it; timeout, "Dừng Lại", "Unbind & Free Memory"
  or switching to Ai Đó ends in GHOSTED_EXIT with a recorded reason. The timeout and the
  countdown interval are cleared on every phase change and on unmount.
- Inputs labelled with `useId()`; empty number fields count as 0. The red flag is
  announced through `<output role="status" aria-live="polite">`.
- Phase stepper with `aria-current="step"`, CSS Modules, 375px without horizontal scroll,
  `prefers-reduced-motion` respected.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build
```

## Architecture

| File | Responsibility |
|---|---|
| `src/fsm/relationshipMachine.js` | Phases, transition table, `canDispatch` guard, pure reducer, `REPLY_WINDOW_MS` |
| `src/fsm/effort.js` | Pure score derivation from the signal log |
| `src/hooks/useGhostTimer.js` | Reply-window timeout and countdown with cleanup |
| `src/components/SituationshipAnalyzer.jsx` | Wires reducer, timer and child components |
| `src/components/PhaseStepper.jsx`, `SignalForm.jsx`, `EffortReport.jsx` | Stepper, labelled signal form, scores, `<meter>` and red-flag output |

## Verification status

| Check | Result |
|---|---|
| Initial scores (seed 100 × 0.1 vs 1 × 50) | Em 10, Ai Đó 50, ratio 0.2; red flag after "Bắt đầu hẹn hò" |
| Add Em 1000 steps / Ai Đó 3 steps | Em 110 → "[OK] Stable"; Ai Đó 200 → red flag again |
| Ghost timer | Countdown 5 → 1, GHOSTED_EXIT (TIMEOUT) about 5.2 s after sending |
| Reply at about 2 s | Timer cancelled, phase unchanged, nothing fires 6 s later |
| Dừng Lại / switch to Ai Đó / Unbind mid-countdown | Immediate exit (STOPPED / SWITCHED / UNBOUND), countdown removed |
| Unmount mid-countdown | No console errors |
| 375 x 667 | Page `scrollWidth` 375 |
| `npx eslint src` / `npx vite build` | 0 problems / success |

Screenshots are included in the submitted Word report.
