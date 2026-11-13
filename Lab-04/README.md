# Lab 04 – Multi-Route SPA, Context Form Engine & Full-Stack React 19

## Overview
This lab bridges Lab 02 and Lab 03 into a multi-route, full-stack React 19 app:
React Router v7 nested layouts (`<Outlet />`, `NavLink`, `useParams`, `useSearchParams`),
route-level code-splitting with `React.lazy` + `<Suspense>`, a Context-driven form engine
with synchronous validation (no `useEffect` chains), and a custom data hook with
`AbortController` talking to an Express / Mongoose 8 REST API.

## Project Structure

```text
Lab-04/
├── Exercises/
│   ├── Exercise-1/   # Sprint 1 – Router v7 master-detail + lazy (Ex 1.2, 1.3, 1.3.1, 1.3.2)
│   ├── Exercise-2/   # Sprint 2 – Context form engine, no useEffect chaining (Ex 1.6)
│   └── Exercise-3/   # Sprint 3 – useForumMessages + Express API (Ex 1.7.1)
│       ├── client/
│       └── server/
├── Homework-1/       # Photo & Evidence Gallery
├── Homework-2/       # Card-Swipe Deck + Express/Mongoose
├── Homework-3/       # Esports Fair-Play Appeal Tribunal
├── .env.example
├── AI_FAILURE_AUDIT.md
├── COMMIT_HISTORY.md
├── README.md
├── TASK_DECOMPOSITION.md
└── project-rules.md
```

## Exercises

### Exercise 1 – Responsive Master-Detail Directory & Case Dossier Router
React Router v7 nested layout, `NavLink` active styling, `useParams` detail route with 404 guard,
lazy-loaded detail view with dimension-matched skeleton.
Status: Completed

### Exercise 2 – Context-Driven Multi-Field Form Engine
`FormContext` with synchronous derived validation, `useId` label binding,
`aria-invalid` / `aria-describedby`, live `<ShowData />` inspector.
Status: Not started

### Exercise 3 – Full-Stack `useForumMessages` Hook & Live Channel Switcher
Custom hook with `AbortController` cleanup, Express REST API with CORS and POST payload validation.
Status: Not started

## Homeworks

| Homework | Description | Status |
|---|---|---|
| Homework 1 | Photo & Evidence Gallery SPA — `useSearchParams` deep linking, native `<dialog>` lightbox, WCAG 2.2 AA | Not started |
| Homework 2 | 'Hẹn Hò Nhưng Không Yêu' Card-Swipe Deck — keyboard/pointer swipe, LIFO undo, Express + Mongoose 8 | Not started |
| Homework 3 | Esports Fair-Play Appeal Tribunal — `/dossier/:playerId`, context form, anti-drift SLA timer | Not started |

## Technologies
- React 19 + Vite, React Router v7
- JavaScript ES2024, CSS Modules
- Node.js, Express, Mongoose 8 (MongoDB)
- Git and GitHub

## Development Guidelines
Follow `project-rules.md` and track progress in `TASK_DECOMPOSITION.md`.
Each exercise / homework is a standalone app: `npm install` then `npm run dev`.
For full-stack parts, start the API first (`cd server && npm run dev`), then the client (`cd client && npm run dev`).
Secrets go in `.env` (never committed); see `.env.example`.