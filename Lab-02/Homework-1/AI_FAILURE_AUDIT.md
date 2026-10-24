# AI Failure Audit — Homework 1

This audit records defects actually found during independent review and the evidence for each correction. Test ideas are not reported as observed failures. Browser screenshots and machine-readable test evidence belong in the ignored `evidence/` directory and are not committed.

## Verification scope

- Pure model: immutable source rows, stable sorting, case-insensitive filtering, page bounds and empty results.
- Browser: semantic table and ARIA grid, one roving tab stop, arrow navigation, Enter selection, Space toggling, sort/filter/page controls, selection stability, responsive overflow, and literal rendering of HTML-like text.
- Accessibility: native labels and controls, focus visibility, contrast, selected and sorted states, status announcements, and actual Lighthouse Accessibility/Best Practices results when available.

## Observed defects

### 1. Back-forward-cache return lost the controller

- Observed source: the initial application entry point registered an unconditional, one-time `pagehide` callback that called `controller.destroy()`.
- Failure: `pagehide` also fires when a page enters the back-forward cache. The cached document would return with delegated listeners removed and no `pageshow` restoration path.
- Correction: retain the listener and destroy only when `event.persisted` is false. A cached document keeps its existing controller; a later terminal pagehide can still clean it up.
- Verification: independent source review confirms the persisted guard and removal of the one-time option. A Node lifecycle simulation imports the actual entry point, retains all five delegated listeners after persisted pagehide, changes page successfully, then removes the listeners on terminal pagehide. A browser back return remained interactive, but the preview reset state; actual BFCache restoration remains unverified.

### 2. Empty selection buttons had insufficient boundary contrast

- Observed source: the unselected row button had no visible text and used a `#a7afbf` border against `#ffffff`.
- Failure: independent sRGB relative-luminance calculation gives 2.2042:1. The border is the empty button's visible control boundary and falls below the 3:1 non-text contrast requirement.
- Correction: input/select, row-toggle and pagination control borders now use `--control: #7b8499`.
- Verification: the replacement color calculates 3.7482:1 against white, and source inspection confirms all three control rules use it. The calculation is recorded in ignored `evidence/03-source-contrast.txt`; actual browser computed styles confirmed rgb(123,132,153) borders against white; screenshot 07 shows the rendered controls.

### 3. Pagination boundary dropped keyboard focus

- Observed browser: with 16 rows per page, Enter on Next reaches page 2 of 2, disables the focused Next button and leaves `document.activeElement` as BODY. Returning with Previous to page 1 similarly loses focus. The accessibility observation reports focus on the page root.
- Failure: keyboard users lose their actionable position when the page direction becomes unavailable.
- Correction: capture the active pagination control before changing disabled states. If that exact control becomes disabled, focus its enabled opposite; use Rows per page when both directions are disabled. Preserve intermediate-page and unrelated search/grid focus.
- Verification: real keyboard Enter now moves Next→Previous on the last page, Previous→Next on the first, and retains Next on an intermediate page. Screenshot 10 records the boundary before correction, screenshot 14 visibly shows the corrected focused Previous button. Two regression tests cover boundary handoff, intermediate/unrelated focus and the both-disabled fallback. The complete independent suite passes 24/24.

### 4. Narrow-grid focus left the active date clipped

- Observed browser: in a real 390px-wide iframe, ArrowRight reached the Joined cell, but its right edge was 439.53px while the scroll container ended at 358px. Only a sliver of the focus outline appeared and the date remained offscreen. Enter selected the row but retained the clipped focus. Screenshot 21 and DOM observation 22 record this state.
- Failure: keyboard navigation moved logical focus without revealing the focused cell's content on a narrow layout.
- Correction: grid-owned focus explicitly scrolls the cell into view with nearest alignment on both axes. Programmatic cell focus uses preventScroll before that explicit adjustment; unrelated control focus is preserved.
- Verification: the same arrows and Enter now retain the full Joined cell (right 357.53px within container right 358px), readable 08 Apr 2024 and 3px focus outline. Screenshot 27 and DOM 25 prove visible focused selection. Input filtering remains focused and pagination boundary handoff still works. A focused visibility regression passes, and the independent suite is 24/24.

These are four independently observed defects. The first two were found in source review; the latter two were reproduced in the actual browser. Application screenshots, actual DOM/computed-style observations and genuine Lighthouse reports are retained, but these are not DevTools-panel screenshots. The assignment's specific DevTools proof requirement remains open where no such panel was available.

## Evidence limits

Automated checks do not establish complete WCAG 2.2 AA conformance. Manual screen-reader compatibility requires assistive-technology testing; a Lighthouse score is not a substitute.

Actual Lighthouse 13.5.0 output in ignored `evidence/28-lighthouse-final-verified.report.html` and `.json` verifies 100/100 Accessibility and 100/100 Best Practices. This does not verify screen-reader speech or complete WCAG 2.2 AA conformance.
