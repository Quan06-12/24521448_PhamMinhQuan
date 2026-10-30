# Lab 03 – Project Rules (AI Governance)

## 1. Stack
- React 19 + Vite + ES2024 (builds on Lab 02).
- Mount with `createRoot` from `react-dom/client` inside `<StrictMode>`.
- Import only the hooks you use (no `import * as React`).

## 2. Banned Legacy APIs
- No `class extends React.Component`, `ReactDOM.render`, `defaultProps`.
- No `keyCode` / `keypress`; use `e.code`.
- No `window.alert()`; use `role="alert"` / `role="status"`.
- No `http://` media URLs.

## 3. Semantic HTML (Zero Div-Soup)
- Use `main`, `section`, `article`, `header`, `dl/dt/dd`, `figure`, `output`, `ul/li`.
- Use `<Fragment key>` instead of wrapper divs.
- Every `<button>` declares `type="button"` unless it submits a form.

## 4. Accessible Forms
- Pair every `input` / `select` with `<label htmlFor={id}>` using `useId()`.
- Read numeric inputs with `valueAsNumber` + `Number.isNaN` fallback.

## 5. State Hygiene
- Immutable updates only (spread, `filter`, `map`, `toSorted`).
- Never sync derived filter/sort state inside `useEffect`.
- Lists use stable entity IDs as keys, never indexes.

## 6. Effect Cleanup
- Every timer, listener, fetch or audio node created in `useEffect` must be cleaned up
  (`clearTimeout`, `removeEventListener`, `AbortController.abort()`, `osc.stop()`).
- Dependency arrays list every reactive value read inside the effect.

## 7. Git Workflow
- Conventional Commits (`feat`, `fix`, `style`, `docs`, `chore`, `test`).
- One verified slice per commit; check `git status` and `git diff` first.
- Never commit `node_modules/`, `dist/` or `evidence/`.
