# Homework 1 — AI failure audit

Only defects actually observed during development are listed. Each entry
records the prompt, the AI output, the observed bug, DevTools proof and the
fixing commit. Screenshots are included in the submitted Word report.

## Failure #01: Pad grid collapses to 2 columns at 375px

- **Prompt**: "Add a responsive CSS Module layout with a 3-column pad grid at 375px."
- **AI Code**: `grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));`
- **Bug**: The AI sized the column minimum without subtracting the page and
  panel padding. Available width at 375px is 375 − 32 − 32 = 311px, but three
  96px columns plus two 12px gaps need 312px, so the grid fell back to
  2 oversized columns and pushed the hit log far below the fold.
- **DevTools Proof**: Device toolbar at 375 × 667 showed 2 columns
  (`evidence/hw1-375px-before.png`).
- **Engineering Fix (Commit 7d2b386)**: Changed the minimum to 88px
  (3 × 88 + 2 × 12 = 288px ≤ 311px). Re-verified 3 columns and no horizontal
  scroll at 375px (`evidence/hw1-375px.png`).

## Failure #02: Scaffold missing meta description and robots.txt

- **Prompt**: "Set up the Vite app shell and page title for the drum kit."
- **AI Code**: `index.html` with only `<title>`; no `public/robots.txt`.
- **Bug**: Lighthouse SEO scored 82. Without `robots.txt`, the Vite SPA
  fallback served `index.html` at `/robots.txt`, so Lighthouse parsed HTML as
  robots rules and reported 14 errors.
- **DevTools Proof**: Lighthouse (mobile, production build, incognito) listed
  "Document does not have a meta description" and "robots.txt is not valid —
  14 errors found" (`evidence/hw1-lighthouse-seo-before.png`).
- **Engineering Fix (Commit 5ca13e7)**: Added `<meta name="description">` and
  `public/robots.txt`, rebuilt, verified both files in `dist/`, and re-ran
  Lighthouse: SEO 100 (`evidence/hw1-lighthouse.png`).

## Failure #03: Unused variable from rest-destructuring in state update

- **Prompt**: "Remove a pad's flash token from state immutably."
- **AI Code**: `const { [padId]: _removed, ...rest } = prev; return rest;`
- **Bug**: The pattern is immutable but leaves an unused binding; ESLint
  `no-unused-vars` flagged `_removed` in `App.jsx`.
- **DevTools Proof**: ESLint warning underlined in VS Code.
- **Engineering Fix (Commit 6057410)**: Copy then delete on the copy
  (`const next = { ...prev }; delete next[padId]; return next;`), which keeps
  state immutable and passes lint.