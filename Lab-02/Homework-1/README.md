# Homework 1 — People directory

A dependency-free enterprise data grid built with native HTML and ES modules.
The contract is recorded in `contracts.ts` before implementation. Progress is
tracked in `TASK_DECOMPOSITION.md`; independent review is recorded in
`QA_REVIEW.md`.

## Scope

Case-insensitive search, team and status filters, sortable member columns,
pagination, persistent row selection, and an ARIA grid on a native table.
Arrow keys navigate cells; Enter selects a row and Space toggles it.

## Run locally

From this directory, use an HTTP server so the browser can load ES modules:

```sh
python3 -m http.server 8101 --bind 127.0.0.1
```

Open `http://localhost:8101`. No build step, package installation, external
fonts, network service, or credentials are needed. The 32 records are fictional.
Selection and filters live only in memory and reset on a full reload.

Run the automated tests with Node.js 22 or newer:

```sh
npm test
```

## Use the grid

- Search across names, roles, teams, status, and location. Search ignores case
  and diacritics; team and status filters combine with search.
- Activate a column heading to sort ascending, then descending. Dates sort by
  their ISO values. Changing filters, sort, or page size returns to page one.
- Tab enters the grid at one cell. Arrow keys move through visible cells and
  column headings without wrapping; Tab exits the grid.
- On a member cell, Enter selects its row and Space toggles selection. On a
  sortable heading, either key changes sort order. Row selection buttons also
  toggle selection. Selection survives filtering, sorting, and pagination.
- Clear selection removes all selected IDs, including rows hidden by filters.

The native table carries explicit ARIA grid metadata, selected row states,
sorted headings, and global row indices across pages. Result and selection
changes update a polite live status. The table can scroll horizontally on
narrow screens. All record values are constructed as text with DOM APIs.

## Implementation

`src/query.js` contains pure query and selection operations. `src/grid-view.js`
constructs the table. `src/grid-controller.js` owns state and five delegated
listeners on the directory section; redraws add no listeners and `destroy()`
removes them. `src/main.js` preserves those listeners during back-forward cache
navigation. The HTML shell supplies labeled controls; CSS supplies presentation.

## Verification status

The independent Node suite passes 24/24 tests: 14 model tests, nine in-memory DOM-double tests and one actual-entry lifecycle simulation. All 21 earlier tests remain, with three additional regressions for pagination-boundary focus and focused-cell visibility. Actual desktop browser review verifies semantic metadata, arrow navigation, Enter/Space, Tab exit, sorting, combined filters, empty results, page controls, persistent selection and focus after page boundaries. Review and evidence mapping are recorded in `QA_REVIEW.md`.

Actual Lighthouse 13.5.0 using Chromium 153.0.8010.0 with mobile emulation verified **100/100 Accessibility** and **100/100 Best Practices**, without audit runtime errors. Genuine HTML/JSON reports are retained in ignored `evidence/28-lighthouse-final-verified.report.*`. The audit used original source on a local HTTP server; actual UI interactions used the authorized Sites preview. No standalone browser UI automation was substituted for manual browser review.

A real 390px-wide iframe also verifies narrow control wrapping, grid-only horizontal scrolling, full focused-cell visibility, selection and pagination. This is narrow CSS layout evidence, not real-device mobile testing. Screen-reader speech, actual BFCache restoration, real-device testing and specific DevTools-panel screenshots remain unverified. The available browser APIs did not expose viewport emulation or DevTools panels. Lighthouse mobile emulation and desktop screenshots are identified accurately. No complete WCAG 2.2 AA conformance claim is made. Evidence files remain ignored by Git.

`AI_FAILURE_AUDIT.md` records four actual findings and corrections: BFCache lifecycle cleanup, control-boundary contrast, pagination-boundary focus loss and clipped focus in the narrow grid. It distinguishes source findings, actual browser reproduction, test simulations and remaining evidence limits.
