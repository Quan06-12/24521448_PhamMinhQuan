# Homework 3 — AI failure audit

Only defects actually observed are listed. Screenshots are included in the
submitted Word report.

## Failure #01: Fourth drop card orphaned on its own row

- **Prompt**: "Lay out the drops as cards in a responsive grid; no horizontal scroll at 375px."
- **AI Code**: `.drops { grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)); }`
- **Bug**: at 1280px the rule produced three columns, so the fourth card (Last Circle
  Mini Crate) sat alone on a second row with two empty slots beside it.
- **DevTools Proof**: desktop screenshot at 1280 x 800 with the card grid 3 + 1.
- **Engineering Fix (Commit 7e61fd7)**: one column by default and
  `repeat(2, minmax(0, 1fr))` from 48rem; measured card tops 243, 243, 484, 484 (2 x 2),
  page `scrollWidth` still 375 at 375px.

## Failure #02: Contract phase EXPIRED never produced

- **Prompt**: "Implement the slide's domain contract:
  `DropPhase = 'WARMUP' | 'AIRDROP_LIVE' | 'LOOTED_OUT' | 'EXPIRED'`."
- **AI Code**: the phase helper returned only WARMUP, AIRDROP_LIVE or LOOTED_OUT; drops had
  no claim window, so a live drop stayed claimable forever.
- **Bug**: one of the four contract states was unreachable, and the UI could not show a
  closed drop.
- **DevTools Proof**: code review of the phase derivation; no card ever showed EXPIRED in
  browser runs. After the fix the Last Circle crate switched to EXPIRED 60.1 s after load.
- **Engineering Fix (Commit 3676ff3)**: each drop has `claimWindowMs`; the timer hook also
  returns elapsed time and the phase is derived in render. The Last Circle crate expires
  about 60 s after load and its button reads "Claim window closed" (disabled).

## Failure #03: Non-conflict claim errors rethrown from a click handler

- **Prompt**: "Optimistic claim with automatic rollback when the server returns 409."
- **AI Code**: in `useDropClaims`, `catch (error) { rollback; if (409) notice; else throw error; }`
  inside the async function called from `onClick`.
- **Bug**: any error other than 409 became an unhandled promise rejection; stock was
  rolled back but the user saw no message.
- **DevTools Proof**: code review of the catch block. After the fix, `?fail=1` shows the alert
  790 ms after the click, stock returns to 12, and the page logs no unhandled rejection.
- **Engineering Fix (Commit c0ea479)**: the error path keeps the rollback and shows
  "Claim failed — stock restored, try again" in a `role="alert"` region; nothing is rethrown.

## Note on the slide reference hook

The slide's `usePubgAirdropTimer` calls `syncClock()` (a synchronous setState) directly in
the effect body, which `eslint-plugin-react-hooks` 7 reports as `react-hooks/set-state-in-effect`.
This implementation stores the wall clock in state and derives the remaining time in render
instead. This is a finding about the reference code, not counted as a failure above.
