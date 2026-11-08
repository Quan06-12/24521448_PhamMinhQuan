# Lab 03 – Task Decomposition

## Setup
- [x] Create the Lab-03 folder structure and documentation.
- [x] Commit: `chore(lab3): init lab 03 structure and rules`

## Exercise 1: Semantic DeveloperCard
- [x] Scaffold Vite React app.
- [x] Implement `DeveloperCard.jsx` and `SkillBadge.jsx` with zero `<div>`.
- [x] Add `DeveloperCard.module.css` (375px responsive).
- [x] Verify: `grep '<div'` and `grep 'http://'` return 0 matches.

## Exercise 2: ScientistDirectory
- [x] Normalize `SMART_PEOPLE` schema with stable IDs.
- [x] Add search, Min-IQ filter and `toSorted` (no `useEffect`).
- [x] Add delete / reset and `<output role="status">` counter.
- [x] Keep keyboard focus after delete; responsive 375px CSS module.

## Exercise 3: PUBG VN Match Telemetry
- [x] Implement 4-state machine + `AbortController`.
- [x] Add skeleton UI and retry alert.
- [x] Verify rapid squad switching cancels requests (Network tab).
- [x] Responsive 375px CSS module; skeleton height matched to the success card.

## Homeworks
- [x] Homework 1 – see `Homework-1/TASK_DECOMPOSITION.md`.
- [x] Homework 2 – see `Homework-2/TASK_DECOMPOSITION.md`.
- [x] Homework 3 – see `Homework-3/TASK_DECOMPOSITION.md`.
- [x] Record at least 3 observed AI bugs in `AI_FAILURE_AUDIT.md`.

## Bonus Exercise: SituationshipAnalyzer
- [x] Model the relationship FSM with a pure reducer.
- [x] Derive effort scores and the red flag during render.
- [x] 5-second ghosting timer with cleanup on phase change and unmount.
- [x] Responsive 375px CSS module.
