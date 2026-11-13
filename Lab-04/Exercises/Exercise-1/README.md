# Exercise 1 — Responsive Master-Detail Directory & Case Dossier Router

React 19 + React Router v7 nested routes covering Ex 1.2, 1.3, 1.3.1 and 1.3.2.

## Scope

- `<BrowserRouter>` + declarative `<Routes>` / `<Route element>` (no v5 APIs).
- Shared `Layout` with `NavLink` className callback (`isActive`) and `<Outlet />`; root link uses `end`.
- `PeopleLayout` master-detail grid `minmax(200px, 1fr) 2fr`, single column at ≤ 600px.
- `PersonDetail` reads `useParams()`, guards unknown ids with a `role="alert"` 404 state,
  renders attributes as `<dl>/<dt>/<dd>`.
- `PersonDetail` is code-split with `React.lazy` and wrapped in `<Suspense>`;
  `DetailSkeleton` uses `aria-busy` / `aria-live="polite"` and matches the detail box size.

## Run locally

```sh
npm install
npm run dev
```

## Verification (Sprint 1)

| Check | Result |
|---|---|
| Reload `/people/2` (deep link) | Same person rendered |
| `/people/999` | "Person not found." alert, no crash |
| `/abc` | 404 page inside the shared layout |
| Active link: only the current route is highlighted; Home not active on `/people` | Pass |
| 375px: list stacks above detail, no horizontal scroll | Pass |
| Slow 3G + reload `/people/1`: skeleton shown, no layout shift on swap | Pass |
| `npm run build` emits a separate `PersonDetail-*.js` chunk | Pass |
| `npm run lint` | 0 problems |
| `Select-String -Path src\*\*.jsx,src\*.jsx -Pattern "Switch\|activeClassName\|exact"` | 0 matches |
| Console (clean Incognito profile) | 0 errors / warnings |

Screenshots are included in the submitted Word report.