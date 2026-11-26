# Homework 1 — Production Photo & Evidence Gallery

React 19 + React Router v7 evidence gallery for an esports fair-play appeal.
Category filters and the open photo live in the URL, so every view is a shareable deep link.

## Scope

- Multi-route SPA: Home, `/gallery`, 404 page inside a shared layout with a skip link.
- Deep linking with `useSearchParams`: `?category=<id>` filters the grid, `?photo=<id>` opens the lightbox.
- Native HTML `<dialog>` lightbox (`showModal()`): focus trap, Esc to close, Back button closes it.
- Prev / next with buttons and arrow keys; focus returns to the last viewed card.
- WCAG 2.2 AA target: 44px targets, labelled icon buttons, `aria-current` filters, visible focus.
- Performance target: Lighthouse 100 with sized, lazy-loaded WebP images (480w grid / 1200w lightbox).

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
| `src/hooks/useGalleryParams.js` | Reads / writes `?category` and `?photo` |
| `src/components/Layout.jsx` | Skip link, main navigation, `<Outlet />` |
| `src/components/CategoryFilter.jsx` | Filter links with `aria-current` |
| `src/components/PhotoGrid.jsx` | Thumbnail links with sized, lazy images |
| `src/components/Lightbox.jsx` | `<dialog>` synced to the URL, prev / next, focus return |
| `src/pages/PhotoGalleryLayout.jsx` | Derives visible photos and the selected photo during render |

## Verification status

| Check | Result |
|---|---|
| Deep link `/gallery?category=hardware&photo=p04` opens filtered grid + lightbox | Pending |
| Esc / close button / backdrop click remove `photo` from the URL | Pending |
| Back button closes the lightbox | Pending |
| Unknown `?photo=` shows an alert, unknown `?category=` falls back to All | Pending |
| Focus trapped in the dialog and returned to the last viewed card | Pending |
| 375px: single-column grid, no horizontal scroll | Pending |
| Lighthouse mobile (production build, Incognito) | Pending |
| `npm run lint` | Pending |

Screenshots are included in the submitted Word report.