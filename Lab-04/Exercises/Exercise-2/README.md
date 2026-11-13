# Exercise 2 — Context-Driven Multi-Field Form Engine

React 19 form engine for Ex 1.6: validation is derived during render, shared through Context.

## Legacy anti-pattern (Ex 1.6)

The legacy `SimpleForm` / `InputField` pair chained five effects per keystroke
(`syncToParent` → `validateField` → `calcFormValidity` → `syncErrorsToChild` → `autoScrollToError`).
Each effect set state, triggering another render: up to 5 renders per key, out-of-order
updates on fast typing, and a risk of "Maximum update depth exceeded".

## Refactor

- `validateForm(values)` is a pure function called during render → `errors` / `isValid`
  are always in sync, one render per keystroke, zero effect hooks.
- `FormContext` + `useFormContext()` replace prop drilling; React 19 `<FormContext value>` provider.
- `InputField`: `useId()` label binding, `aria-invalid`, `aria-describedby` → `role="alert"` error.
- Cross-field rule (confirm password) derived in the same pass.
- `ShowData` renders the submitted payload as a `<dl>` inspector (password never shown).

## Run locally

```sh
npm install
npm run dev
```

## Verification (Sprint 2)

| Check | Result |
|---|---|
| Banned-hook grep over `src` (effect hook) | 0 matches |
| `<div` grep over `src` | 0 matches |
| React DevTools Profiler: 1 render per keystroke | Pass |
| Error appears on blur / submit, input gets red border + `aria-invalid="true"` | Pass |
| Mismatched confirm password blocks submit | Pass |
| Valid submit renders `<ShowData />` inspector | Pass |
| Clicking a label focuses its input (`useId` binding) | Pass |
| `npm run lint` | 0 problems |

Screenshots are included in the submitted Word report.
