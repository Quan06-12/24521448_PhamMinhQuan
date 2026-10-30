# Lab 03 consolidated AI failure audit

Only observed findings are listed. Each entry must include the prompt, the AI code,
the bug, DevTools proof and the fixing commit.

| Homework | Finding | Correction and verification |
| --- | --- | --- |
| 1 | Pad grid fell to 2 columns at 375px (`minmax(96px)` ignored padding) | `minmax(88px)`; DevTools 375px shows 3 columns, no horizontal scroll (`7d2b386`) |
| 1 | Missing meta description and robots.txt; Lighthouse SEO 82 | Added both; Lighthouse SEO 100 (`5ca13e7`) |
| 1 | Rest-destructuring left unused `_removed` binding (ESLint) | Copy-then-delete on the copy (`6057410`) |

Detailed records:

- [Homework 1 audit](Homework-1/AI_FAILURE_AUDIT.md)
- [Homework 2 audit](Homework-2/AI_FAILURE_AUDIT.md)
- [Homework 3 audit](Homework-3/AI_FAILURE_AUDIT.md)