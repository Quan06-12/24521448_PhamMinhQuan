# Lab 03 consolidated AI failure audit

Only observed findings are listed. Each entry must include the prompt, the AI code,
the bug, DevTools proof and the fixing commit.

| Homework | Finding | Correction and verification |
| --- | --- | --- |
| 1 | Pad grid fell to 2 columns at 375px (`minmax(96px)` ignored padding) | `minmax(88px)`; DevTools 375px shows 3 columns, no horizontal scroll (`7d2b386`) |
| 1 | Missing meta description and robots.txt; Lighthouse SEO 82 | Added both; Lighthouse SEO 100 (`5ca13e7`) |
| 1 | Rest-destructuring left unused `_removed` binding (ESLint) | Copy-then-delete on the copy (`6057410`) |
| Ex 1 | JSDoc comment contained a `<div>` literal, so the zero-div grep audit returned 1 match | Reworded the comment; grep returns 0 matches (`4c2cdeb`) |
| Ex 2 | Same pattern as Ex 1: a comment containing `useEffect` made the no-effect grep audit return 1 match | Reworded the comment before committing; grep returns 0 matches (`7c88bd0`) |
| Lab 3 | The comment pattern from Ex 1 and Ex 2 recurred in 4 more places (`keyCode` ×2 in HW1, `defaultProps` in Ex 1, `window.alert` in Ex 3), each tripping a banned-API grep | Reworded all comments; a lab-wide grep returns 0 matches (`b459957`, `09261d9`) |
| Ex 3 | Skeleton frame copied the slide's 220px, but the success card measured 272px at 375px, so loading → success shifted the layout by 52px | Frame `min-height: 280px`; DevTools shows 280px in both states (`6963c43`) |
| 2 | Render counter (`data-renders`) shipped in the production build | Guarded with `import.meta.env.DEV`; no attribute in `dist/` (`dffbe49`) |
| 3 | Four drop cards in a three-column grid left one card orphaned | Two-column grid from 48rem; 2 x 2 measured (`7e61fd7`) |
| 3 | Contract phase EXPIRED was never produced | Claim window per drop; EXPIRED derived in render (`3676ff3`) |
| 3 | Non-409 claim errors rethrown from the click handler (unhandled rejection, no message) | Rollback plus `role="alert"` notice; nothing rethrown (`c0ea479`) |

Detailed records:

- [Homework 1 audit](Homework-1/AI_FAILURE_AUDIT.md)
- [Homework 2 audit](Homework-2/AI_FAILURE_AUDIT.md)
- [Homework 3 audit](Homework-3/AI_FAILURE_AUDIT.md)
