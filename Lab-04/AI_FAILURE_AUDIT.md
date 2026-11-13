# Lab 04 consolidated AI failure audit

Only observed findings are listed. Each entry must include the prompt, the AI code,
the bug, DevTools proof and the fixing commit.

| Scope | Finding | Correction and verification |
| --- | --- | --- |
| Ex 1 | Comment containing "activeClassName" made the banned-API grep return 1 match | Reworded the comment; grep returns 0 matches (`268dbfe`) |
| Ex 1 | `App.jsx` imported `./data/people.js` before the file existed; Vite overlay "Failed to resolve import" | Created `src/data/people.js` with string ids; build passes (`e42b918`) |
| Ex 2 | Comment containing "useEffect" in `validateForm.js` made the no-effect grep return 1 match | Reworded to "effect hook" before committing; grep returns 0 matches |

Detailed records:

- [Homework 1 audit](Homework-1/AI_FAILURE_AUDIT.md)
- [Homework 2 audit](Homework-2/AI_FAILURE_AUDIT.md)
- [Homework 3 audit](Homework-3/AI_FAILURE_AUDIT.md)