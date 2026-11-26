# Homework 1 — work breakdown

Each slice follows contract → isolated implementation → DevTools verification → commit.
Screenshots are included in the submitted Word report, never in Git.

- [x] Step 0 – Scaffold React 19 Vite app with `react-router@7`, docs and meta description — `145614d`
- [x] Step 1 – Photo catalogue (`data/photos.js`) and optimized WebP assets (480w / original width) — `cad521d`
- [x] Step 2 – Router layout (`NavLink`, `<Outlet />`), skip link, Home and 404 pages — `e6b04a5`
- [ ] Step 3 – `useGalleryParams` hook: `?category=` and `?photo=` as the single source of truth
- [ ] Step 4 – `CategoryFilter` and `PhotoGrid` as deep links (`aria-current`, sized lazy images)
- [ ] Step 5 – Native `<dialog>` lightbox synced to `?photo=` (Esc, Back button, deep link)
- [ ] Step 6 – Prev / next, arrow keys, backdrop close, focus return to the last viewed card
- [ ] Step 7 – Accessibility pass (44px targets, labels, contrast) and Lighthouse mobile run
- [ ] Step 8 – README verification table and observed AI bugs in `AI_FAILURE_AUDIT.md`
- [ ] Verify screen-reader speech (NVDA / Narrator)
- [ ] Test on a physical mobile device