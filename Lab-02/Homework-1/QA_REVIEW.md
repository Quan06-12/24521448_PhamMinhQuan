# Independent QA Review — Homework 1

Each feature is independently reviewed before integration. Evidence is captured under ignored `evidence/` and remains outside Git. Documentation-only and pure-model commits have no rendered interaction surface; their browser check is explicitly not applicable. Browser review occurred on the integrated UI draft, not retroactively on earlier commits.

| Slice | Independent checks | Browser/evidence | Result |
| --- | --- | --- | --- |
| Contracts and project rules (`04cb838`) | Member/column/query/controller types and ten invariants reviewed before commit | Not applicable: documentation only | Pass |
| Dataset and query model (`10cd6ae`) | 14 Node tests, stable ties, identity, numeric bounds, immutable and frozen results reviewed before commit | Not applicable: pure model; `02-query-tests.txt` | Pass |
| Semantic grid view | Native table/head/body/column scope; explicit grid/row/gridcell roles, rowcount 33/colcount 6, global row indices, one roving stop; safe-text tests | Actual browser DOM and AX plus screenshots 07–09; Node DOM doubles | Pass for desktop and narrow iframe |
| Delegated controller | Real arrows clamp, Enter selects, Space toggles, header Space sorts, Tab exits; combined filters, sort/page/empty results and persistent selection; five delegated listeners and teardown tested | Browser notes 15; screenshots 07–10, 14 and 27; boundary-focus and clipped-cell corrections independently rechecked | Pass |
| Application shell and styling | Labels, empty feedback, desktop layout and visible focus; actual computed #7b8499 control borders and 3px focus outline | Screenshots 07–09 and 14; source shell check 06; narrow iframe screenshots 20 and 27 | Desktop and 390px iframe pass |
| Regression fixes | BFCache persisted guard simulation; control boundary contrast 3.7482:1; actual browser boundary-pagination and clipped-cell focus defects fixed and rechecked | Lifecycle simulation; contrast 03; screenshot 10 before, 14 after; 21 narrow before, 27 after | Pass within stated scope |
| Lighthouse audit | Actual Lighthouse 13.5.0, Chromium 153.0.8010.0, mobile emulation on original source; no runtime error | `28-lighthouse-final-verified.report.html` and `.json`; metadata 29 | Accessibility 100/100; Best Practices 100/100 |

## Actual browser review

The authorized preview at `http://terminal.local:4173/Homework-1/` was reviewed using supported cloud-browser CUA interaction and read-only DOM inspection. The original connected browser could not reach the local server; after the user explicitly authorized demo content in the cloud browser, the Sites preview supplied the working route. No standalone browser UI automation or raw CDP was used.

The independent final Node suite passes 24/24 (14 model, nine DOM-double, one actual-entry lifecycle simulation), preserving all 21 prior cases and adding two pagination-focus regressions and a focus-visibility regression. In the real browser, selecting Amelia survives Engineering+Active+CHAU filtering, empty results, resetting filters, sorting and pagination. Native focus, selected/sorted state and live-status content were inspected. Browser back remained interactive, but preview navigation reset state; actual BFCache restoration was not established.

Lighthouse audited the original source on a separate local HTTP server, without the preview's injected live-reload script. Final metadata 29 confirms matching source hashes before and after the audit. The CLI is a dedicated audit, not a replacement for actual browser interactions. The first attempt 11 failed with CONNECTION_REFUSED and null scores and is not acceptance evidence. Successful report 28 records both 100 scores and no runtimeError.

## Evidence mapping and limits

- `07-browser-desktop-selected.jpg`: desktop grid, selected Amelia, visible cell focus.
- `08-browser-combined-filters.jpg`: Engineering+Active+CHAU, one matching member, hidden selection retained.
- `09-browser-empty-results.jpg`: empty feedback and disabled pagination.
- `10-browser-pagination-focus-before.jpg`: final-page boundary before correction; accompanying actual DOM read showed BODY focus.
- `14-browser-pagination-focus-after-stable.jpg`: corrected final-page boundary with visible focus on Previous.
- `19-browser-dom-observation.json`: actual browser DOM read for grid metadata, pagination indices, focus and computed borders.
- `20-browser-390px-iframe.jpg`: narrow search/filter wrapping and horizontal grid scroll.
- `21-browser-390px-grid-focus.jpg`, `22-browser-390px-dom.json`: actual clipped focus before correction.
- `27-browser-narrow-focus-after-stable.jpg`, `25-browser-narrow-focus-after-dom.json`: full focused Joined cell after correction and retained selection.
- `30-browser-final-lighthouse-report.jpg`: actual rendered final Lighthouse report with both 100 scores.
- `31-independent-final-node.txt`: final independent 24/24 test output.
- `15-browser-qa-notes.md`: actual interactions, computed styles, focus observations and limitations.
- `28-lighthouse-final-verified.report.html`, `.json`, `29-lighthouse-final-verified-metadata.json`: genuine audit output and settings.

Screenshots 13 and 26 do not show the verified interaction state and are not acceptance evidence. In the later case the fresh AX state remained correct; a separate screenshot call captured the correct state in 27. Screenshots are desktop application views, not fabricated DevTools captures. Supported CUA APIs exposed no viewport emulation or DevTools panel. A real 390px-wide iframe was therefore used for narrow CSS review: search/filter/footer wrapping passes; document clientWidth and scrollWidth both 375px (scrollbar accounts for the rest), while the table scrolls within its own container. Arrow navigation to Joined now fully reveals the focused date, and selection redraw retains visible focus. Narrow filter focus and both pagination boundaries were rechecked. This is not real-device mobile testing; device testing and DevTools-panel screenshots remain open. Lighthouse's mobile emulation is identified separately. Screen-reader speech has not been tested, and 100 Lighthouse scores do not establish complete WCAG 2.2 AA conformance. Captured console errors came from the browser extension's metadata reporting; no application-origin error was observed.
