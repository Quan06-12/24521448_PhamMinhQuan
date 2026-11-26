# Lab 04 consolidated AI failure audit

Only observed findings are listed. Each entry must include the prompt, the AI code,
the bug, DevTools proof and the fixing commit.

| Scope | Finding | Correction and verification |
| --- | --- | --- |
| Ex 1 | Comment containing "activeClassName" made the banned-API grep return 1 match | Reworded the comment; grep returns 0 matches (`268dbfe`) |
| Ex 1 | `App.jsx` imported `./data/people.js` before the file existed; Vite overlay "Failed to resolve import" | Created `src/data/people.js` with string ids; build passes (`e42b918`) |
| Ex 1 | Skeleton `min-height` (260px) shorter than the loaded detail (269.8px) → 10px layout shift | Raised `.detail` to `min-height: 280px`; both states measure 280px (`2555d5e`) |
| Ex 2 | Comment containing "useEffect" in `validateForm.js` made the no-effect grep return 1 match | Reworded to "effect hook" before committing; grep returns 0 matches |
| HW1 | Duplicate `aria-current="page"` (filter pill + header NavLink) | Pill changed to `aria-current="true"`; one current-page element in DevTools |
| HW1 | Lightbox taller than a laptop viewport; Source row hidden behind a dialog scrollbar | Image capped with `max-height: 50dvh`; no dialog scrollbar at 1920×1080 |
| HW1 | Claimed only 3 thumbnails load first; Chrome actually fetched 7 of 9 at 375px | Claim corrected in README; lazy-loading code unchanged |

Detailed records:

- [Homework 1 audit](Homework-1/AI_FAILURE_AUDIT.md)
- [Homework 2 audit](Homework-2/AI_FAILURE_AUDIT.md)
- [Homework 3 audit](Homework-3/AI_FAILURE_AUDIT.md)