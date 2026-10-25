# Lab 02 – Modern React Architecture, Virtual DOM & State Machines

## Overview
This lab focuses on understanding the internal architecture of modern React applications by implementing a simplified Virtual DOM rendering engine, a reactive state system, and asynchronous UI state management.

## Project Structure

```text
Lab-02/
├── Exercises/
│   ├── Exercise-1/
│   ├── Exercise-2/
│   └── Exercise-3/
├── Homework-1/
├── Homework-2/
├── Homework-3/
├── README.md
├── project-rules.md
└── TASK_DECOMPOSITION.md
```

## Exercises

### Exercise 1 – Mini-React VNode & Mounting Engine
Status: Completed

- Implemented `createTextElement()`.
- Implemented `createElement()`.
- Implemented `renderToDOM()`.
- Verified DOM rendering and click events.
- Tested safe text rendering against HTML injection.

### Exercise 2 – Reactive State & Event Delegation
Status: Not started

- Implement custom `useState()`.
- Implement event delegation.
- Build a reactive Task Manager.

### Exercise 3 – Async State Machine
Status: Not started

- Implement IDLE, LOADING, SUCCESS, and ERROR states.
- Build a skeleton loader.
- Implement error handling and retry functionality.

## Technologies
- HTML5
- JavaScript ES6+
- Browser DOM APIs
- Git and GitHub
- Visual Studio Code

## Development Guidelines
Follow `project-rules.md` and track implementation progress in `TASK_DECOMPOSITION.md`.


## Homework implementation and verification

Homework folders are direct children of `Lab-02`, as required for this submission.

| Folder | Assignment | Verification record |
| --- | --- | --- |
| `Homework-1/` | Accessible data grid with sorting, filtering, pagination and keyboard navigation | Local `TASK_DECOMPOSITION.md`, `QA_REVIEW.md` and `AI_FAILURE_AUDIT.md` |
| `Homework-2/` | Concurrent preparation and FIFO Web Audio playback with cancellation and visualizer | Local `TASK_DECOMPOSITION.md` and `AI_FAILURE_AUDIT.md` |
| `Homework-3/` | Deadline countdown and optimistic inventory reservation state machine | Local `TASK_DECOMPOSITION.md` and `AI_FAILURE_AUDIT.md` |

Each homework has its own contracts, implementation, tests and README. Current verification status is recorded in those files; implementation alone does not establish browser or accessibility acceptance.

Evidence is stored in each homework's ignored `evidence/` folder. Do not force-add that folder to Git. Screen captures, Lighthouse outputs and local test logs are supplied separately with the report.


## Homework results

| Homework | Automated tests | Actual browser checks | Audit result |
| --- | ---: | --- | --- |
| 1 | 24 passed | Keyboard grid, filters/sort/page, focus and desktop/390px iframe | Lighthouse Accessibility 100 and Best Practices 100 |
| 2 | 17 passed | Real WAV decode/playback, FIFO/cancel/error/cleanup and desktop/390px iframe | Functional checks pass; cloud cadence does not establish 60fps |
| 3 | 34 passed | Checkout/retry/expiry, competing shoppers, sale closure, restart and focus | Stock conservation and late-response rejection verified |

The unified post-integration Node run passed all 75 tests. No application source was changed by that integration check. Each homework retains its individual contracts, tests and independent verification record.

These are measured results, not a claim of complete accessibility certification or production backend concurrency guarantees. Screen-reader speech, physical-device testing and native DevTools-panel screenshots remain outside the observed scope. Homework 2's cloud cadence sample was approximately 2.41fps; verify the 60fps target on an appropriate local display before claiming it.

The English submission report and separate evidence archive contain the screenshots and actual Lighthouse outputs. Evidence remains outside Git. See `AI_FAILURE_AUDIT.md` for the consolidated findings and `COMMIT_HISTORY.md` for the published atomic commit history.
