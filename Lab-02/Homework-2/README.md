# Current — Concurrent FIFO audio queue

A local listening desk for Lab 02 Homework 2. Three original synthesized tracks are downloaded and decoded concurrently, then played in enqueue order through a Web Audio analyser and canvas spectrum.

## Run

Requires Node.js 20+ and a modern browser with Web Audio, Canvas 2D, ResizeObserver and AbortController. No package installation or external assets are required.

```sh
cd Lab-02/Homework-2
npm start
```

Open `http://localhost:8102`. Set `PORT` to choose another port. Add individual tracks or queue the collection, then press **Play queue** to resume audio from a user gesture. Playback stays enabled for subsequent additions in the current session. Volume and frequency-bin detail can be changed independently. Cancel individual tracks or all live work; **Clear finished** removes terminal history.

```sh
npm test
npm run generate:audio
```

The generator reproduces mono 22,050 Hz, 16-bit PCM WAV assets from original deterministic synthesis. It fetches no audio or dependencies.

## Ownership and ordering

- The queue reserves up to three preparation slots across both download and decode. Playback uses a separate single-source lane and never lets later ready tracks overtake an earlier pending track.
- Fetch receives the task's AbortSignal. Browser decode is not abortable: cancelled decode keeps its slot until settlement and its late buffer is discarded.
- Completion/cancellation/failure detaches `onended`, disconnects the source and clears its buffer; cancellation also stops playback. Finished snapshots contain metadata only.
- The application owns its AudioContext. Page teardown disposes the queue/visualizer, stops RAF and closes the context. Restored documents can create a fresh listening session.
- 256/512 frequency bins use FFT sizes 512/1024. RAF reuses the frequency array and draws canvas directly; it does not publish queue snapshots or rebuild queue rows per frame.

The typed module boundary and exact invariants are in [CONTRACTS.md](CONTRACTS.md) and [src/contracts.d.ts](src/contracts.d.ts). Work slices are recorded in [TASK_DECOMPOSITION.md](TASK_DECOMPOSITION.md).

## Verification status

Independent Node checks cover WAV headers/durations/peaks, live static-server HTTP responses, cancellation at every preparation await boundary, bounded concurrency, out-of-order preparation with FIFO playback, queued/ready/playing cancellation, source-start/preparation failures, late callbacks, disposal/resume races, immutable snapshots, FFT bins and 25 repeated enqueue/cancel cycles. Injected RAF/canvas and application DOM/audio tests cover drawing lifecycle, array reuse, layout-read separation, context-resume error retry, visibility changes and pagehide/restore cleanup.

Authorized Chrome cloud-browser checks now verify real WAV decoding and playback states, animated spectrum, FIFO progression, cancellation, keyboard controls, volume/detail settings and desktop/390px responsive layouts. A separate visible diagnostic page loads the actual modules with real Web Audio nodes and controlled decode-settlement gates: three preparation slots, blocked-head FIFO, late-cancel suppression, real HTTP/invalid-audio failures with successful continuation, source/node cleanup and context close all pass. Resume denial is injected and explicitly distinguished from native decoding/playback.

The browser sample measured 9 visualizer frames over 3.317 seconds (about 2.41fps) in this cloud session, with zero queue snapshots and one reused frequency array. The browser does not expose display hardware/refresh configuration or DevTools UI, so the 60fps target remains unverified and this sample is not a DevTools trace. No Lighthouse score, physical-device result or subjective audible-listening claim is made. Browser console observations include extension metadata errors and a corrected diagnostic-harness error; no production-app uncaught error was observed. Screenshots and detailed outcomes are mapped in the ignored `evidence/browser-checklist.md`.

[AI_FAILURE_AUDIT.md](AI_FAILURE_AUDIT.md) records the actual server-root defect found and corrected during independent review, plus the evidence and remaining limits.
