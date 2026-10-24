# AI failure audit — Midnight Market

This report records findings observed in generated working code and corrected after independent review. None was planted. The review task was to implement and adversarially verify an expiring, versioned inventory store, an injectable countdown and asynchronous checkout. The original requests did not ask for vulnerable examples.

Automated evidence is reproducible with `npm test`. Browser/DevTools proof remains **pending** because browser access was blocked; unit and source review are not represented as browser verification. Generated logs/screenshots belong in ignored `evidence/` and are never submission source.

## 1. Invalid injected clock created immortal locks and a runaway timer

**Observed generated implementation:** inventory used `const time = now()` without a finite-number guard, then built `expiresAt` from another unchecked clock value. The timer similarly calculated `Math.max(0, deadline - now())` without checking its clock dependency.

**Reproduction:** provide `now: () => NaN`. Inventory accepted a reservation with `expiresAt: NaN`; `sweep()` returned false and stock conservation still passed. Separately, the countdown emitted `NaN` and scheduled another animation frame because `NaN === 0` is false.

**Risk:** the injectable dependency contract could create an unexpiring hold or an endless invalid countdown. Native `Date.now()` is not claimed to return NaN. These two manifestations are grouped as **one** missing dependency-validation flaw.

**Refactor:** require a callable clock, validate each sampled timestamp before inventory mutation, and stop the timer before throwing for a nonfinite sample. No tick or completion callback is emitted for an invalid timer sample.

**Evidence:** `tests/qa-inventory.test.js` invalid-clock regression and `tests/qa-timer.test.js` invalid-clock regression. Independent QA first reproduced the failures, then checked the corrections.

## 2. A reservation mixed several different instants

**Observed generated implementation:** `reserve()` called `sweep()` (which read the clock), then tested `now() >= saleEndsAt`, then used `now() + reservationMs` to construct the hold. These reads did not describe one coherent operation timestamp.

**Reproduction:** for a sale ending at 500, an injected clock yielding 499, 499, 500 produced a successful `RESERVED` result whose `expiresAt` was already 500 at the last sample. A stepping clock also showed that reservation duration was measured from a later instant than the sale/expiry checks.

**Risk and scope:** a boundary consistency flaw, not an overselling demonstration. The earlier sale check can be interpreted as a linearization point, but the generated implementation did not consistently use it for the resulting deadline. The interface needs one explicit, testable timestamp per synchronous operation.

**Refactor:** capture one validated timestamp at the start of `reserve()` and pass it through lock expiry, sale predicates and deadline construction. A reservation initiated exactly at the captured sale deadline is rejected; a reservation initiated before it is capped to that deadline.

**Evidence:** `tests/qa-inventory.test.js` single-clock-sample regression. QA independently reproduced the multi-read behavior and verified one clock read per reservation after the change.

## 3. Rejected checkout changed inventory without updating the view

**Observed generated implementation:** the controller returned `Promise.resolve(started)` immediately when `beginCheckout()` returned an unsuccessful result, without calling `onChange`. The UI intentionally rendered on state-change notifications and successful periodic sweeps.

**Reproduction:** reserve at time 0 with a 1000 ms hold, advance to 1000, then start checkout before the next animation frame. `beginCheckout()` expires the hold, returns `EXPIRED`, and the original controller emits no notification. The next `sweep()` returns false because the expiry was already applied. The UI's cached snapshot therefore remains `RESERVED` with a zero-second clock until another render-triggering action.

**Risk:** stale availability, a stale bag status and no immediate explanation for a rejected checkout. The inventory still prevents purchasing the expired item.

**Refactor:** rejected checkout starts also notify the observer, allowing the view to render the authoritative snapshot and explain `EXPIRED`. Disposed controllers continue to suppress notifications.

**Evidence:** `tests/qa-checkout-controller.test.js` failed-start/expiry regression first failed with actual notifications `[]` versus expected `['EXPIRED']`. The regression also verifies the subsequent sweep is false, demonstrating why the periodic render path cannot repair the cached view by itself. The browser interaction itself is still pending browser review.
