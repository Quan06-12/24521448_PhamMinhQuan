# Homework 2 — Full-Stack Card-Swipe Deck ("Hẹn Hò Nhưng Không Yêu")

React 19 card-swipe deck backed by an Express + Mongoose 8 REST API on a local MongoDB.
Profiles are fictional; every swipe is persisted, so a reload restores progress and score.

## Scope

- Dual input: keyboard (← Nope, → Like, ↑ Super, Backspace Undo; key repeat ignored) and
  Pointer Events for mouse, pen and touch (80px threshold, live drag preview, `touch-action: none`).
- LIFO undo stack: `history` is pushed on swipe and popped on undo; the server deletes the record first,
  so the stack and the database never disagree.
- Asymmetric score: Like +10, Super +20, Nope −5. Score, counts, like rate (`<meter>`) and verdict are
  derived from the history during render (`computeMetrics`), never stored in state.
- Full-stack persistence: `GET /api/profiles`, `GET/POST/DELETE /api/swipes`, payload validation,
  one swipe per profile (unique index → 409), JSON error handler.
- Security: `MONGODB_URI` read from `process.env` with a fail-fast guard; `.env` is git-ignored,
  only `.env.example` is committed; CORS limited to `http://localhost:5173`.

## Run locally

Requires Node.js 20.19+ and MongoDB running on `127.0.0.1:27017`.

```sh
# Terminal 1 – API (http://localhost:3002)
cd server
npm install
cp .env.example .env      # PowerShell: Copy-Item .env.example .env
npm run seed              # 8 fictional profiles, clears swipes
npm run dev

# Terminal 2 – client (http://localhost:5173, the only origin allowed by CORS)
cd client
npm install
npm run dev
```

## API

| Method | Route | Result |
|---|---|---|
| GET | `/api/health` | `{ ok, db }` |
| GET | `/api/profiles` | Profiles in seed order (`.lean()`) |
| GET | `/api/swipes` | Swipe history, oldest first |
| POST | `/api/swipes` | `{ profileId, direction }` → 201; 400 missing/invalid; 404 unknown profile; 409 duplicate |
| DELETE | `/api/swipes/:id` | Undo one swipe → 200; 400 bad id; 404 not found |
| DELETE | `/api/swipes` | Reset history → `{ deletedCount }` |

## Architecture

| File | Responsibility |
|---|---|
| `server/server.js` | Env guard, CORS, routes, validation, central JSON error handler |
| `server/models/Profile.js`, `Swipe.js` | Mongoose schemas (`enum`, `unique`, timestamps) |
| `server/seed.js`, `data/profiles.js` | Idempotent seed of fictional profiles |
| `client/src/hooks/useDeckData.js` | Parallel fetch with one `AbortController`, retry |
| `client/src/hooks/useSwipeInput.js` | Keyboard + pointer input, drag offset, threshold |
| `client/src/components/SwipeDeck.jsx` | History state, swipe, LIFO undo, derived current card |
| `client/src/utils/score.js`, `ScoreBoard.jsx` | Pure asymmetric metrics and their view |

## Verification status

| Check | Result |
|---|---|
| MongoDB 9.0.8 + mongoose 8.24.11 connect; `/api/health` → `db: connected` | Pass |
| Missing `MONGODB_URI` → fail fast; MongoDB stopped → "connection failed", process exits | Pass |
| POST valid 201 / duplicate 409 / missing field 400 / bad direction 400 / bad id 400 | Pass |
| DELETE swipe 200, same id again 404 | Pass |
| Keyboard ← → ↑ swipe; holding a key swipes once; Backspace undoes the last swipe | Pass |
| Mouse drag past 80px swipes with a stamp preview; short drag snaps back | Pass |
| Undo returns the most recently swiped card; works after a page reload | Pass |
| Score: → ↑ ← = 25 pts, like rate 67%; undo and reload keep the score consistent | Pass |
| Server down: load error with Retry; swipe / undo errors shown, state unchanged | Pass |
| 375px: no horizontal scroll, even while dragging a card off-screen | Pass |
| Lighthouse mobile (production build on port 5173, Incognito) | See report |
| `npm run lint` (client) | Pass |

Screenshots are included in the submitted Word report.