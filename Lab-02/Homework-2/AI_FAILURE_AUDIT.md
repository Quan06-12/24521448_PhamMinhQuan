# Homework 2 — Independent verification and AI failure audit

The audit records defects actually observed during implementation review or testing. It does not invent bugs to meet an example count. Checks marked static are not browser or DevTools evidence.

## Verification record

| Slice | Independent check before commit | Result | Browser applicability |
| --- | --- | --- | --- |
| 1 — Contracts and project setup | Reviewed typed states, default concurrency, FIFO invariant, cancellation at non-abortable decode, source ownership, context ownership, FFT/bin mapping, safe text/delegation rules, ignored evidence and task decomposition | Pass; implementation remains to be verified in later slices | Not applicable: no runtime UI in this slice |
| 2 — Local audio and static server | Independent PCM header/duration/peak checks and live Node HTTP requests for root, audio MIME, no-store, missing files and traversal | Pass after fixing observed root containment defect; 2 tests | Real browser later fetched and decoded all three WAV assets successfully |
| 3 — Abortable preparation | Injected fetch/body/decode promises; checked phase order, signal forwarding, already cancelled work, cancellation at each asynchronous boundary, HTTP/body/decode failures | Pass; 6 tests | Native browser decoding passes; separate diagnostic uses controlled decode-settlement gates for reproducible races |
| 4 — Queue ownership and ordering | Controlled promises complete out of order; cancellation of queued/decode/ready/playing tasks; preparation-slot retention; late callback suppression; preparation/start errors; source cleanup; disposal/resume race; metadata immutability, FFT bins and 25 repeated cancel/clear cycles | Pass; 7 tests | Browser real AudioBufferSourceNodes pass FIFO, natural completion, playing/ready cancellation and cleanup; diagnostic gated decode retains slot and suppresses late playback |
| 5 — Canvas visualizer | Injected RAF/canvas/resize doubles verify a single frame loop, typed-array reuse and bins change, no frame layout reads, DPR cap, stale-frame suppression, observer/listener teardown and idempotent disposal | Pass; 1 lifecycle test | Visible animated bars; actual native-analyser sample gives 9 frames/3.317s, zero queue snapshots, one reused array, zero post-dispose reads; 60fps target unverified |
| 6–7 — Application and styling | Source review for semantic controls, delegated actions, safe text, stable task rows, responsive rules; injected real-app lifecycle test checks resume failure/retry, asynchronous failure announcement, visibility RAF pause, cancel-all, pagehide disposal/context close and back/forward restore | Functional and visual browser gates pass; 1 injected integration test retained | Real Chrome keyboard Enter/Space/Tab/Shift+Tab, visible focus, native controls and announcements; desktop and actual 390px iframe viewport screenshots have no horizontal overflow |

## Observed defects

### 1. Static server rejected the application root

- Observed code: the root from `fileURLToPath(new URL('../', import.meta.url))` retained a trailing slash, while the requested path passed through `resolve()` did not. The containment condition therefore rejected an otherwise identical root.
- Reproduction: start the generated server and request `/`; Node fetch returned **403**, while `/assets/soft-current.wav` returned **200** with `audio/wav`.
- Impact: opening the documented application URL could not load its index.
- Correction: normalize the root with `resolve()` before comparing equality and descendant paths.
- Independent verification: the HTTP regression test accepts root index lookup (404 before index exists; 200 after it exists), serves the WAV, and still rejects encoded parent traversal with 403. All 8 asset/server/preparation tests passed after the correction.
- Evidence type: executed Node HTTP regression and code review; no browser/DevTools claim.

## Evidence and limitations

- Independent QA plan: local, ignored `evidence/qa-plan.md`; authorized-browser checklist: `evidence/browser-checklist.md`.
- Current deterministic test inventory: 17 executed passing tests across assets/server (2), preparation (6), queue (7), visualizer lifecycle (1) and application lifecycle (1). Tests use controlled doubles except real WAV bytes and local HTTP.
- After the earlier cloud denial, the user explicitly authorized generated demos in the cloud browser. The supported preview route `http://terminal.local:4173/Homework-2/` successfully served the unchanged runtime source for real UI checks on 2026-10-24. Ignored diagnostic and narrow-viewport pages live under `evidence/` and load the same runtime modules.
- Evidence: `desktop-initial.jpg`, `desktop-playing.jpg`, `cancel-all-stable.jpg`, `narrow-390-initial.jpg`, `narrow-390-playing-focus.jpg`; scenario records `browser-concurrency.txt`, `browser-resources.txt`, `browser-failures.txt`, `browser-resume.txt`, `browser-cadence.txt`, and actual captured `browser-console.json`.
- Native diagnostics observed source stop/disconnect, cleared buffer/onended, analyser/gain disconnect and closed owned context. This supports explicit cleanup; no heap-retention or universal zero-memory-leak claim is made. Actual application pagehide/restore instrumentation remains covered by the injected lifecycle test rather than native-resource inspection.
- Console capture contains repeated browser-extension metadata errors and one corrected QA-harness error (`Cannot close a closed AudioContext`); production code was unchanged and no production-app uncaught error was observed. HTTP 404 and invalid audio were intentional diagnostic failures.
- Actual cadence: 9 frames across 3317ms, mean interval 414.56ms, median 208.5ms, p95/max 1017.4ms, approximately 2.41fps, viewport 1363×936, DPR 1. This cloud session did not establish the 60fps target. Display hardware/refresh configuration and DevTools UI are not exposed; a local 60Hz DevTools Performance trace remains outstanding. No invented DevTools screenshot, trace, Lighthouse score, physical-device or subjective audible-listening result is claimed.
