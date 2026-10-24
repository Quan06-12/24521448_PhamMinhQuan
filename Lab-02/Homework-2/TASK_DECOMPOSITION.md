# Homework 2 task decomposition

Each slice is independently reviewed before its Conventional Commit. Review evidence and test runs are recorded by the QA partner; evidence/ is intentionally ignored.

- [x] 1. Define typed contracts, lifecycle invariants, setup and local rules.
- [x] 2. Generate local audio samples and add a portable static development server.
- [x] 3. Implement abortable download and guarded asynchronous decode.
- [x] 4. Implement bounded concurrent preparation, FIFO playback and resource cleanup.
- [x] 5. Implement the analyser-driven RAF canvas with resize/teardown.
- [x] 6. Connect semantic queue/catalog controls and lifecycle announcements. Source, injected lifecycle and real browser functional review pass; committed after independent browser approval.
- [x] 7. Add responsive, limited-palette styling and visual polish. Desktop and actual 390px iframe viewport visual/keyboard checks pass; committed after independent browser approval.
- [ ] 8. Verify browser behavior, fix observed issues, and finish the README/audit. Authorized real Web Audio, diagnostic races/errors/cleanup, screenshots and console observations recorded. Local 60Hz DevTools performance evidence remains outstanding; cloud cadence was about 2.41fps and is disclosed.

## Verification targets

- Concurrent preparation may finish out of order; playback may not.
- Cancel before preparation, during download/decode and during playback.
- HTTP/decode/source failures release resources and allow the queue to continue.
- Repeated enqueue/cancel cycles leave no live sources or retained buffers.
- 256/512 bins map to 512/1024 FFT size; RAF does not emit snapshots.
- Browser playback, keyboard controls, responsive layout and no uncaught errors.
