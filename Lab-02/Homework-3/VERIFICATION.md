# Verification record

## Completed independently

- Reservation tests: conservation, concurrency, exact expiry, sale deadline, malformed inputs, idempotency, snapshot isolation and clock regressions.
- Checkout FSM tests: current-attempt matching, duplicate start/completion, release then stale callback, failure/retry, exact hold/sale boundaries and malformed completion.
- Payment controller tests: one scheduled task per hold, cancellation, queued stale callback, failure, expiry, disposal, invalid options and failed-start notification.
- Race tests: common-version contention, fresh-version retry, no oversell, cancellation cleanup and invalid input.
- Countdown tests: absolute-deadline behavior, skipped frames, exact completion, stop, one RAF chain, formatting and invalid-clock cleanup.

Run `npm test` from `Lab-02/Homework-3`. Tests use Node's built-in test runner and injected time/schedulers. They do not use a browser or a synthetic DOM.

## Authorized live browser review — 2026-10-24

The user explicitly authorized running the generated demo after the earlier approval block. QA used the supported cloud browser at `http://terminal.local:4173/Homework-3/`, normal controls and read-only DOM inspection. The page uses real clocks, animation frames and payment timeouts; QA did not inject inventory state, alter the clock or replace browser behavior with a synthetic DOM. The 34 prior deterministic tests were preserved and were not redundantly rerun for documentation-only review.

- [x] Desktop layout at a 1363 × 936 browser viewport: document width 1348 px, with no horizontal overflow or clipped product text.
- [x] Browser console capture: no application module/runtime error or warning observed. The capture includes Chrome-extension metadata errors, explicitly distinguished from application errors, and preview live-reload messages. This is actual `tab.dev.logs` output, not a DevTools screenshot or network trace.
- [x] Keyboard skip link followed by native Tab reaches the first Reserve control; keyboard activation of checkout, cancel, race and restart works. Native labeled selects are present.
- [x] Checkout focus failure reproduced and fixed: Enter checkout → Cancel payment focus; approval/expiry/release → bag heading focus. Async completion leaves a different focused select untouched.
- [x] `role="status"` contains meaningful action messages. The millisecond visual countdown is `aria-hidden`; accessible timer has `aria-live="off"`. This verifies DOM semantics, not screen-reader audio output.
- [x] Reserve → approve; reserve → decline → retry → approve; reserve → release. Counts and reservation labels agree.
- [x] Slow 18-second payment outlives the 15-second hold: row becomes expired, stock returns and late response cannot purchase.
- [x] Cancel slow payment, wait 19 seconds beyond its original callback: row remains released, totals remain 12 available / 0 held / 0 sold.
- [x] Run 20 shoppers with five units available: 1 first-pass winner, 19 conflicts, 5 purchases after retries, 15 unfilled. Totals 6 available + 0 held + 6 sold = 12, including an earlier user purchase.
- [x] Restart during a slow pending payment, then wait 19 seconds: new demo remains 12 / 0 / 0, with zero reservation rows and fresh status.
- [x] Navigate away during pending payment, then use browser history Back: fresh two-minute demo, 12 / 0 / 0 and zero rows; no stalled prior checkout. This does not assert which browser cache path was used.
- [x] Natural two-minute sale closure with two existing purchases and a hold initiated just before the deadline: hold is capped to sale end and expires; timer reaches 00:00.000; all Reserve controls and race disable; totals remain 10 / 0 / 2 even after the late payment response.
- [x] Actual 390px-wide iframe CSS layout and keyboard review at `qa-narrow.html#hw3`: inner document client/scroll width both 375 px (vertical scrollbar consumes the remainder), all visible control bounds within the document. Hero/copy/countdown stack cleanly; Enter on checkout focuses Cancel payment with a visible focus ring. This is a real iframe viewport, not mobile device emulation.
- [ ] Separate tablet-width/device browser review has not been performed.
- [ ] Actual hide/resume behavior: opening a second cloud tab left `document.visibilityState` as `visible`, so this environment did not establish a genuinely hidden-tab test. Deterministic skipped-frame tests cover deadline arithmetic only.
- [ ] Restart while a race is actively pending: the microtask race completes before another ordinary browser action can reach Restart. Generation/cancellation behavior has deterministic coverage, but this precise overlap is not claimed as a UI observation.

## Local evidence mapping

All browser artifacts remain under ignored `evidence/` and are excluded from submission source.

| Artifact | Actual observation |
|---|---|
| `qa3-desktop-full.jpg` | Full desktop layout, prices, controls and status region |
| `qa3-checkout-focus-fixed-verified.jpg` | Pending checkout with visible keyboard focus on Cancel payment |
| `qa3-late-payment-expired.jpg` | Expired Cloud Buds hold, returned stock and retained earlier purchase |
| `qa3-sale-closed.jpg` | Natural closure, disabled actions, expired hold, retained purchases and heading focus |
| `qa3-narrow-390-hero.jpg` | Actual 390px iframe hero, countdown and totals |
| `qa3-narrow-390-checkout-focus.jpg` | Actual narrow bag/controls with keyboard focus on Cancel payment |
| `qa3-console.json` | Unedited actual browser console capture including extension noise |
| `qa3-browser-observations.md` | QA observation record and workflow outcomes |

`qa3-checkout-focus-before.jpg` and `qa3-checkout-focus-fixed.jpg` captured an earlier compositor frame immediately after an action; they are not used to prove the focus defect or fix. `qa3-narrow-390-top.jpg` shows the outer harness at Homework 1 rather than Homework 3 and is also excluded. The direct active-element observations and the later `-verified` capture provide that evidence.

No DevTools screenshot/trace, Lighthouse score or full accessibility certification is asserted by this record.
