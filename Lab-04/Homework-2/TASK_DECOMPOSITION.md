# Homework 2 — work breakdown

Each slice follows contract → isolated implementation → verification → commit.
Screenshots are included in the submitted Word report, never in Git.

- [x] Step 0 – Folder structure and docs — `cdcba7b`
- [x] Step 1 – Express server, `MONGODB_URI` env guard, Mongoose 8 connection to local MongoDB — `4e78402`
- [x] Step 2 – `Profile` model, seed script, `GET /api/profiles` with `.lean()` — `d6b66d9`
- [x] Step 3 – `Swipe` model, `POST /api/swipes` with validation, `DELETE /api/swipes/:id` for undo — `d8732f0`
- [x] Step 4 – Vite client and `useDeckData` hook with `AbortController` and retry — `1d63222`
- [x] Step 5 – Swipe deck: current card derived from the swipe history — `3e5b0c8`
- [x] Step 6 – Keyboard (← → ↑) and pointer swipe gestures with drag preview — `2c80de5`
- [x] Step 7 – LIFO undo stack synced with the server (Backspace / Undo button) — `7a37849`
- [x] Step 8 – Asymmetric score and metrics derived during render — `ec13e09`
- [x] Step 9 – `robots.txt`, Lighthouse mobile 98 / 100 / 100 / SEO re-check, verification table, AI audit
- [ ] Verify screen-reader speech (NVDA / Narrator)
- [ ] Test touch swipes on a physical phone