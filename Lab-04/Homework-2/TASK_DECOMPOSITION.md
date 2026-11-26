# Homework 2 — work breakdown

Each slice follows contract → isolated implementation → verification → commit.
Screenshots are included in the submitted Word report, never in Git.

- [x] Step 0 – Folder structure and docs
- [ ] Step 1 – Express server, `MONGODB_URI` env guard, Mongoose 8 connection to local MongoDB
- [ ] Step 2 – `Profile` model, seed script, `GET /api/profiles` with `.lean()`
- [ ] Step 3 – `Swipe` model, `POST /api/swipes` with validation, `DELETE /api/swipes/:id` for undo
- [ ] Step 4 – Vite client and `useProfiles` hook with `AbortController`
- [ ] Step 5 – Swipe deck: current card derived from the swipe history
- [ ] Step 6 – Keyboard (← → ↑ Backspace) and pointer swipe gestures
- [ ] Step 7 – LIFO undo stack synced with the server
- [ ] Step 8 – Asymmetric score and metrics derived during render
- [ ] Step 9 – Accessibility pass, verification table, AI audit