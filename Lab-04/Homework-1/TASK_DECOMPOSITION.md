# Homework 1 — work breakdown

Each slice follows contract → isolated implementation → DevTools verification → commit.
Screenshots are included in the submitted Word report, never in Git.

- [x] Step 0 – Scaffold React 19 Vite app with `react-router@7`, docs and meta description — `145614d`
- [x] Step 1 – Photo catalogue (`data/photos.js`) and optimized WebP assets (480w / original width) — `cad521d`
- [x] Step 2 – Router layout (`NavLink`, `<Outlet />`), skip link, Home and 404 pages — `e6b04a5`
- [x] Step 3 – `useGalleryParams` hook: `?category=` and `?photo=` as the single source of truth — `xxxxxxx`
- [x] Step 4 – `CategoryFilter` and `PhotoGrid` as deep links (`aria-current`, sized lazy images) — `xxxxxxx`
- [x] Step 5 – Native `<dialog>` lightbox synced to `?photo=` (Esc, Back button, deep link) — `xxxxxxx`
- [x] Step 6 – Prev / next, arrow keys, backdrop close, focus return to the last viewed card — `xxxxxxx`
- [x] Step 7 – Accessibility pass, `robots.txt`, Lighthouse mobile 97 / 100 / 100 / 100 — `xxxxxxx`
- [x] Step 8 – README verification table and observed AI bugs in `AI_FAILURE_AUDIT.md`
- [ ] Reach Lighthouse Performance 100 on mobile (currently 97)
- [ ] Verify screen-reader speech (NVDA / Narrator)
- [ ] Test on a physical mobile device