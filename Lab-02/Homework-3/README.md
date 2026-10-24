# Midnight Market — Vietnam 11.11 flash sale

Homework 3 is a dependency-free ES-module simulation of a two-minute Vietnam mega-sale. Three products use VND prices and a shared in-memory stock authority. Each reservation lasts at most 15 seconds and ends sooner if the sale closes.

## Run

From this directory:

```sh
npm test
npm start
```

Open `http://localhost:8103`. An HTTP server is required for browser module imports. `npm start` uses Python 3's static server; there are no npm packages to install. Reloading or choosing **Start a fresh demo** resets inventory and starts a new sale.

## Try the state machine

1. Reserve an item. Its available count decreases immediately while its held count increases.
2. Check out with **Approve payment** and the quick delay. One live hold becomes one purchase.
3. Choose **Decline payment**. The item returns to `RESERVED`, retaining its original deadline. Retry or release it.
4. Choose the **18 seconds** response delay. The 15-second hold expires first, so the late payment cannot purchase it.
5. While payment is pending, choose **Cancel payment**. Its timeout is cancelled, its promise settles and stock returns once; an already queued stale response cannot revive the hold.
6. Run **20 shoppers**. All first attempts use one inventory version. If stock is available, one first-pass attempt wins and the rest conflict. The losers retry once against fresh versions. Successful simulated shoppers complete checkout synchronously; this exercise demonstrates version conflicts and stock conservation, not actual network concurrency.
7. Leave the tab in the background, then return. The displayed countdown derives remaining time from the absolute wall-clock deadline rather than callback counts. Browser scheduling may delay display updates; it does not accumulate countdown drift.

## Architecture and limits

- `src/timer.js`: one `requestAnimationFrame` chain using `deadline - Date.now()`, with injectable clock/scheduler for deterministic tests.
- `src/inventory.js`: synchronous authoritative state machine, optimistic versions, idempotent reservation request IDs, exact expiry, immutable scalar snapshots and runtime stock invariants.
- `src/checkout.js`: simulated payment scheduling, duplicate-start coalescing, cancellation and disposal.
- `src/race.js`: common-version first wave, fresh-version retries and cancellation cleanup.
- `src/view.js`: safe text-node updates, stable reservation rows and focus handoff when actions disappear.
- `src/main.js`: one delegated click listener, timer integration, generation-based race invalidation, page lifecycle cleanup and restart.

Every mutation checks `available + held + sold = total`, nonnegative safe-integer counts, and agreement with reservation records. Only `RESERVED` and `CHECKING_OUT` hold stock. Success requires the current checkout attempt and `now < expiresAt`; pending payment never extends the hold. All remaining holds expire at sale closure.

Reservation request IDs remember the **original** result, even after the hold expires or releases. Retrying an old request is not a new hold; callers must consult a fresh snapshot for current state. Reusing an ID for another product, buyer, quantity or expected version is rejected.

This is one authority in one browser tab. It is not a server lock, distributed transaction, secure payment integration or persistence layer. No money, orders or personal data are sent. There is no claim of protection against users editing their own JavaScript state.

## Verification status

Independent QA tests cover exact boundaries, malformed inputs, immutable snapshots, 100 simultaneous same-version attempts, 1000 deterministic mixed inventory operations, checkout attempts, late/duplicate callbacks, payment cancellation/disposal and a 20-shopper race. The audit documents actual discovered failures and their regressions.

Browser/DevTools verification, responsive screenshots, keyboard walkthrough and live hidden-tab behavior remain **pending**. Source review and deterministic tests do not substitute for those checks. See `VERIFICATION.md`; no Lighthouse or WCAG conformance score has been claimed.
