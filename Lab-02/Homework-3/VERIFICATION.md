# Verification record

## Completed independently

- Reservation tests: conservation, concurrency, exact expiry, sale deadline, malformed inputs, idempotency, snapshot isolation and clock regressions.
- Checkout FSM tests: current-attempt matching, duplicate start/completion, release then stale callback, failure/retry, exact hold/sale boundaries and malformed completion.
- Payment controller tests: one scheduled task per hold, cancellation, queued stale callback, failure, expiry, disposal, invalid options and failed-start notification.
- Race tests: common-version contention, fresh-version retry, no oversell, cancellation cleanup and invalid input.
- Countdown tests: absolute-deadline behavior, skipped frames, exact completion, stop, one RAF chain, formatting and invalid-clock cleanup.

Run `npm test` from `Lab-02/Homework-3`. Tests use Node's built-in test runner and injected time/schedulers. They do not use a browser or a synthetic DOM.

## Browser checks — pending, not executed

Browser access was blocked during this work. The cloud-browser fallback was also blocked by approval review. No alternate browser, CDP or headless automation was used to bypass that decision.

When browser access is authorized, verify the assembled page before committing its UI slice:

- [ ] Desktop, tablet and narrow mobile layouts, with no horizontal overflow or clipped text.
- [ ] Console has no module/runtime errors; resources all load.
- [ ] Keyboard skip link, selects, reserve, checkout, cancel, race and restart.
- [ ] Focus remains usable after a reservation becomes terminal.
- [ ] Screen-reader status messages are meaningful; the millisecond timer is not a live announcement stream.
- [ ] Reserve → approve, reserve → decline → retry, reserve → release.
- [ ] 18-second payment expires a 15-second hold; delayed callback cannot buy it.
- [ ] Cancel payment, then wait past its original callback time; inventory remains consistent.
- [ ] Run 20 shoppers; first wave conflicts and final purchases match available inventory.
- [ ] Restart during a pending payment and race; no prior-generation state leaks into the new demo.
- [ ] Hide/resume tab, confirm deadline catch-up and expiry; close/revisit via browser history to check lifecycle behavior.
- [ ] Sale closure disables reservations and racing, expires remaining holds and retains purchased counts.
- [ ] Save any screenshots/DevTools artifacts under ignored `evidence/` only.

No browser screenshot, DevTools trace, Lighthouse score or full accessibility certification has been asserted.
