# Homework 2 — Independent verification and AI failure audit

The audit records defects actually observed during implementation review or testing. It does not invent bugs to meet an example count. Checks marked static are not browser or DevTools evidence.

## Verification record

| Slice | Independent check before commit | Result | Browser applicability |
| --- | --- | --- | --- |
| 1 — Contracts and project setup | Reviewed typed states, default concurrency, FIFO invariant, cancellation at non-abortable decode, source ownership, context ownership, FFT/bin mapping, safe text/delegation rules, ignored evidence and task decomposition | Pass; implementation remains to be verified in later slices | Not applicable: no runtime UI in this slice |
| 2 — Local audio and static server | Independent PCM header/duration/peak checks and live Node HTTP requests for root, audio MIME, no-store, missing files and traversal | Pass after fixing observed root containment defect; 2 tests | Node HTTP checks only; playback remains pending |
| 3 — Abortable preparation | Injected fetch/body/decode promises; checked phase order, signal forwarding, already cancelled work, cancellation at each asynchronous boundary, HTTP/body/decode failures | Pass; 6 tests | Deterministic Node tests; real Web Audio decoding remains pending |

## Observed defects

### 1. Static server rejected the application root

- Observed code: the root from `fileURLToPath(new URL('../', import.meta.url))` retained a trailing slash, while the requested path passed through `resolve()` did not. The containment condition therefore rejected an otherwise identical root.
- Reproduction: start the generated server and request `/`; Node fetch returned **403**, while `/assets/soft-current.wav` returned **200** with `audio/wav`.
- Impact: opening the documented application URL could not load its index.
- Correction: normalize the root with `resolve()` before comparing equality and descendant paths.
- Independent verification: the HTTP regression test accepts root index lookup (404 before index exists; 200 after it exists), serves the WAV, and still rejects encoded parent traversal with 403. All 8 asset/server/preparation tests passed after the correction.
- Evidence type: executed Node HTTP regression and code review; no browser/DevTools claim.

## Evidence and limitations

- Independent QA plan: local, ignored `evidence/qa-plan.md`.
- Browser screenshots, console observations and performance measurements are pending. The connected extension cannot reach localhost, and automatic approval review denied loading workspace code in the cloud browser. No alternate browser surface is being used to bypass that block.
- A browser timing sample is not a DevTools Performance trace or a universal 60-fps guarantee.
