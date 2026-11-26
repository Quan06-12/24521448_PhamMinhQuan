# Homework 1 — work breakdown

Each slice follows contract → isolated implementation → DevTools verification → commit.
Screenshots are included in the submitted Word report, never in Git.

- [x] Step 0 – Scaffold React 19 Vite app with `react-router@7`, docs and meta description — `145614d`
- [x] Step 1 – Photo catalogue (`data/photos.js`) and optimized WebP assets (480w / original width) — `cad521d`
- [x] Step 2 – Router layout (`NavLink`, `<Outlet />`), skip link, Home and 404 pages — `e6b04a5`
- [x] Step 3 – `useGalleryParams` hook: `?category=` and `?photo=` as the single source of truth — `7d707dc`
- [x] Step 4 – `CategoryFilter` and `PhotoGrid` as deep links, sized lazy images — `dab5b9d`, fix `aria-current="true"` — `0cad48e`
- [x] Step 5 – Native `<dialog>` lightbox synced to `?photo=` — `8d99314`, dialog height cap 60dvh — `d487701`
- [x] Step 6 – Prev / next, arrow keys, backdrop close, focus return — `4ef6a48`, height cap lowered to 50dvh — `5577448`
- [x] Step 7 – `robots.txt` and Lighthouse mobile 97 / 100 / 100 / 100 — `20457f4` (only adds robots.txt; no LCP preload was added)
- [x] Step 8 – README verification table and observed AI bugs in `AI_FAILURE_AUDIT.md` — `0855940`
- [ ] Reach Lighthouse Performance 100 on mobile (currently 97)
- [ ] Verify screen-reader speech (NVDA / Narrator)
- [ ] Test on a physical mobile device