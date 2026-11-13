# Lab 04 – Project Rules (AI Governance)

## 1. Stack
- React 19 + Vite + ES2024, React Router v7 (builds on Lab 02 and Lab 03).
- Backend: Node.js + Express + Mongoose 8 (ES modules or CommonJS, consistent per app).
- Mount with `createRoot` from `react-dom/client` inside `<StrictMode>`.
- Import only the hooks you use (no `import * as React`).

## 2. Banned Legacy APIs
- No `class extends React.Component`, `ReactDOM.render`, `defaultProps`.
- No React Router v5 APIs: `<Switch>`, `<Redirect>`, `exact`, `component={...}`, `activeClassName`.
- No `react-media`, `typeface-*` npm font packages, Material-UI v4.
- No `keyCode` / `keypress`; use `e.code`.
- No `window.alert()`; use `role="alert"` / `role="status"`.
- No `http://` media URLs.

## 3. Semantic HTML (Zero Div-Soup)
- Use `main`, `nav`, `section`, `article`, `header`, `dl/dt/dd`, `figure`, `output`, `ul/li`, `dialog`.
- Use `<Fragment key>` instead of wrapper divs.
- Every `<button>` declares `type="button"` unless it submits a form.
- Icon-only buttons must have an `aria-label`.

## 4. Routing (React Router v7)
- Import from `react-router`; declare routes with `<Routes>` / `<Route element={<X />}>`.
- Shared layouts render children through `<Outlet />`.
- Active links use the `NavLink` className callback `({ isActive }) => ...`; the root link uses `end`.
- Dynamic segments are read with `useParams()` (values are strings) and every lookup has a 404 fallback.
- Shareable UI state (filters, selected item) lives in the URL via `useSearchParams()`.
- Route-level code-splitting with `React.lazy` + `<Suspense>`; skeletons match the real content size (CLS = 0)
  and declare `aria-busy="true"` / `aria-live="polite"`.

## 5. Accessible Forms
- Pair every `input` / `select` with `<label htmlFor={id}>` using `useId()`.
- Invalid fields set `aria-invalid` and point to their error with `aria-describedby`.
- Read numeric inputs with `valueAsNumber` + `Number.isNaN` fallback.

## 6. State Hygiene
- Immutable updates only (spread, `filter`, `map`, `toSorted`).
- Validation errors and form validity are derived during render (`validateForm(values)`),
  never synced through `useEffect` chains.
- Shared form state goes through a Context provider + custom hook (`useFormContext`).
- Lists use stable entity IDs as keys, never indexes.

## 7. Effect Cleanup & Data Fetching
- Every timer, listener or fetch created in `useEffect` must be cleaned up
  (`clearTimeout`, `removeEventListener`, `AbortController.abort()`).
- Every `fetch` passes `{ signal: controller.signal }`; `AbortError` is ignored, other errors are shown.
- No `didCancel` boolean flags; use `AbortController`.
- Dependency arrays list every reactive value read inside the effect.

## 8. Backend & Security
- CORS restricted to the Vite origin (`http://localhost:5173`).
- Validate every POST payload and return `400` with a JSON error for missing fields.
- Generate IDs with `crypto.randomUUID()`.
- Secrets come from `process.env` (e.g. `MONGODB_URI`); commit only `.env.example`, never `.env`.
- Mongoose 8 uses `async/await` (+ `.exec()` on queries) inside `try/catch`; no callbacks,
  no deprecated `useNewUrlParser` / `useUnifiedTopology` flags.

## 9. Git Workflow
- Conventional Commits (`feat`, `fix`, `style`, `docs`, `chore`, `test`, `refactor`).
- One verified slice per commit; check `git status` and `git diff` first.
- Never commit `node_modules/`, `dist/`, `.env` or `evidence/`.
- Record every observed AI mistake in `AI_FAILURE_AUDIT.md`.