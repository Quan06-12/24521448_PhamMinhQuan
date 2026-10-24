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
