# Homework 2 task decomposition

Each slice is independently reviewed before its Conventional Commit. Review evidence and test runs are recorded by the QA partner; evidence/ is intentionally ignored.

- [x] 1. Define typed contracts, lifecycle invariants, setup and local rules.
- [ ] 2. Generate local audio samples and add a portable static development server.
- [ ] 3. Implement abortable download and guarded asynchronous decode.
- [ ] 4. Implement bounded concurrent preparation, FIFO playback and resource cleanup.
- [ ] 5. Implement the analyser-driven RAF canvas with resize/teardown.
- [ ] 6. Connect semantic queue/catalog controls and lifecycle announcements.
- [ ] 7. Add responsive, limited-palette styling and visual polish.
- [ ] 8. Verify browser behavior, fix observed issues, and finish the README/audit.

## Verification targets

- Concurrent preparation may finish out of order; playback may not.
- Cancel before preparation, during download/decode and during playback.
- HTTP/decode/source failures release resources and allow the queue to continue.
- Repeated enqueue/cancel cycles leave no live sources or retained buffers.
- 256/512 bins map to 512/1024 FFT size; RAF does not emit snapshots.
- Browser playback, keyboard controls, responsive layout and no uncaught errors.
