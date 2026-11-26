# Homework 1 — Production Photo & Evidence Gallery

React 19 + React Router v7 evidence gallery for a Teamfight Tactics fair-play appeal.
Category filters and the open photo live in the URL, so every view is a shareable deep link.

## Scope

- Multi-route SPA: Home, `/gallery`, 404 page inside a shared layout with a skip link.
- Deep linking with `useSearchParams`: `?category=<id>` filters the grid, `?photo=<id>` opens the lightbox.
- Native HTML `<dialog>` lightbox (`showModal()`): focus trap, Esc, backdrop click, Back button closes it.
- Prev / next with buttons and arrow keys (history entry replaced, not pushed); focus returns to the last viewed card.
- WCAG 2.2 AA: 44px targets, labelled icon buttons, `aria-current` filters, `role="status"` count, visible focus.
- Performance: sized, lazy-loaded WebP thumbnails (480px), large file only inside the lightbox.

## Run locally

```sh
npm install
npm run dev        # development: http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the build: http://localhost:4173
```

## Architecture

| File | Responsibility |
|---|---|
| `src/data/photos.js` | Photo catalogue, categories and image path helpers |
| `src/hooks/useGalleryParams.js` | Reads / writes `?category` and `?photo`; prev / next use `replace` |
| `src/components/Layout.jsx` | Skip link, main navigation, `<Outlet />` |
| `src/components/CategoryFilter.jsx` | Filter links with `aria-current="true"` |
| `src/components/PhotoGrid.jsx` | Thumbnail links with sized, lazy images and `data-photo-id` |
| `src/components/Lightbox.jsx` | `<dialog>` synced to the URL, prev / next, backdrop close, focus return |
| `src/pages/PhotoGalleryLayout.jsx` | Derives visible photos, selected photo and prev / next during render |

## Verification status

| Check | Result |
|---|---|
| Deep link `/gallery?category=shop&photo=p04` opens filtered grid + lightbox | Pass |
| Esc / close button / backdrop click remove `photo` from the URL | Pass |
| Back button closes the lightbox | Pass |
| Unknown `?photo=` shows an alert, unknown `?category=` falls back to All | Pass |
| Prev / next and arrow keys; buttons disabled at both ends | Pass |
| Focus trapped in the dialog and returned to the last viewed card | Pass |
| 375px: single-column grid, no horizontal scroll | Pass |
| Lighthouse mobile (production build, Incognito): Performance 97, Accessibility 100, Best Practices 100, SEO 100 | Pass (Performance below the 100 target) |
| `npm run lint` | Pass |

Screenshots are included in the submitted Word report.

## Image credits

Screenshots of Teamfight Tactics © Riot Games, collected from public web sources for
non-commercial coursework only.