# Exercise 2 — Interactive Scientist & Pioneer Directory

React 19 data explorer for the legacy `smartPeople` array (slides 18–19).

## Scope

- Normalized `SMART_PEOPLE` with stable ids (`sp-1` … `sp-6`), frozen to catch mutation.
- Case-insensitive name search, Min-IQ filter read with `valueAsNumber`,
  sort by IQ or age with ES2023 `.toSorted()` and a name tie-breaker.
- Only raw inputs live in state (`people`, `query`, `minIq`, `sortBy`);
  the visible list and the count are derived during render — no effect hooks.
- Delete uses `prev.filter(...)`; Reset restores the original snapshot and filters.
- Every control has `<label htmlFor>` bound with `useId()`; the count is announced by
  `<output role="status" aria-live="polite">`.
- Deleting with the keyboard moves focus to the next row's Delete button
  (or the heading when the list is empty) using `flushSync` + a React 19 ref callback.
- CSS Modules; filters stack in one column at 375px with no horizontal scroll.

## Run locally

```sh
npm install
npm run dev
```

## Verification (Checkpoint 2)

| Check | Result |
|---|---|
| `Select-String ... ScientistDirectory.jsx -Pattern "useEffect"` | 0 matches |
| Search `ein` / `EIN` → Albert Einstein only | Pass |
| Min IQ 200 + Age (young to old) → Sidis, Einstein, Goethe | Pass |
| Equal IQ (Newton, Maxwell 190) ordered by name | Pass |
| Keyboard delete keeps focus on the next Delete button; empty list focuses heading | Pass |
| Reset restores 6 pioneers and default filters | Pass |
| Clicking each label focuses its control | Pass |
| 375px: filters stack, no horizontal scroll | Pass |

Screenshots are included in the submitted Word report.