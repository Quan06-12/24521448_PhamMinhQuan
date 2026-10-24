# Homework 3 work breakdown

Each slice follows contract → implementation → independent review/testing → atomic commit.

- [x] 1. Define data contracts, invariants and local project rules.
- [x] 2. Implement an injectable deadline-based animation-frame countdown.
- [x] 3. Implement validated stock reservations, optimistic versions and expiry.
- [x] 4. Implement checkout transitions and cancellation-safe asynchronous orchestration.
- [x] 5. Build semantic Vietnam sale storefront and simulator controls.
- [x] 6. Bind safe DOM views and delegated controls to the inventory model.
- [x] 7. Add responsive styling, focus states and reduced-motion support.
- [x] 8. Integrate timer, lifecycle cleanup and adversarial concurrency demo.
- [x] 9. Record actual audit findings, verification evidence and usage documentation.

## Required invariants

For every product, `available + held + sold = total` and each count is a nonnegative integer. Only `RESERVED` and `CHECKING_OUT` contribute to held stock. Every successful reservation changes the product version. Replayed reservation IDs return the original outcome without mutating stock; reuse with a different intent is rejected. Expired and released locks cannot purchase. Checkout callbacks require the current attempt token and a live reservation. Snapshots cannot mutate the store.

## Transition table

| Current state | Event | Next state |
|---|---|---|
| none | reserve with current stock version | RESERVED |
| RESERVED | begin checkout | CHECKING_OUT |
| CHECKING_OUT | matching payment success before expiry | PURCHASED |
| CHECKING_OUT | matching payment failure before expiry | RESERVED |
| RESERVED / CHECKING_OUT | release | RELEASED |
| RESERVED / CHECKING_OUT | lock deadline or sale deadline reached | EXPIRED |
| terminal state | late checkout completion | unchanged |

## Current checkpoint

The engine retains its independent deterministic QA and eight prior meaningful commits. Authorized browser review now passed the storefront, safe view/integration, checkout/retry/cancellation, natural expiry/closure, stock conservation, keyboard focus and restart/history workflows. A real browser focus defect was corrected and independently rechecked; three independent defect classes plus one qualified clock-boundary weakness are documented. Responsive review passed at desktop and an actual 390px iframe viewport. Tablet/device, actual hidden-tab and mid-race restart observations remain explicitly limited in `VERIFICATION.md`.

The reviewed UI slice and final audit/verification documents await the root maintainer's atomic commits; this checklist records reviewed work, not an assertion that the UI was already committed.
