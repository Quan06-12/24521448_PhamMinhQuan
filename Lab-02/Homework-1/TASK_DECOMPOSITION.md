# Homework 1 — work breakdown

Each slice follows contract → isolated implementation → independent QA → commit.
Browser evidence belongs in ignored `evidence/`, never in Git.

- [x] Define member, column, query, result, selection, and controller contracts.
- [x] Implement immutable member data and pure search/sort/page queries.
- [x] Render a native table with complete ARIA grid metadata and safe text.
- [x] Add delegated selection, sorting, and roving keyboard navigation.
- [x] Assemble filters, pagination, live feedback, and responsive visual design.
- [x] Independently verify model edges, actual desktop keyboard behavior and 390px iframe layout.
- [x] Run actual Lighthouse Accessibility and Best Practices audits: 100/100 each.
- [x] Complete README and truthful per-slice review / failure audit.
- [ ] Verify screen-reader speech and complete WCAG 2.2 AA conformance.
- [ ] Capture specific DevTools-panel proof; test an actual mobile device and BFCache restoration.

## Verification boundaries

- Pure model: 14 independent Node tests for combinations, ordering, clamping and mutation.
- Integrated Node suite: 24/24 passing; all 21 earlier cases retained plus three focus regressions. DOM doubles are explicitly limited; lifecycle simulation imports the actual entry point.
- Actual browser: supported CUA pointer/keyboard input and read-only DOM observations establish native semantics, one roving stop, selection/sort/filter/page behavior, empty results and focus retention.
- Narrow layout: a real 390px-wide iframe checks responsive CSS, controls, grid-only horizontal overflow and fully visible focused-cell content. This is not real-device emulation.
- Accessibility audit: genuine Lighthouse 13.5.0/Chromium 153.0.8010.0 output, final source hashes identical before/after, Accessibility 100 and Best Practices 100. This does not replace screen-reader or complete WCAG review.
- Documentation: independent static review; browser checks N/A for documentation-only and pure-model commits. UI review was on the integrated draft, not fabricated screenshots of earlier commits.

## Handoff

Contracts `04cb838` and query model `10cd6ae` remain preserved. Semantic view/controller and app shell/style/lifecycle slices are independently approved for integration within the reviewed scope. Root owns atomic commits and any push. Four actual findings and their corrections are recorded in `AI_FAILURE_AUDIT.md`. Final evidence mapping is in `QA_REVIEW.md`; screenshots and reports remain ignored.
