# Homework 1 — work breakdown

Each slice follows contract → isolated implementation → independent QA → commit.
Browser evidence belongs in ignored `evidence/`, never in Git.

- [x] Define member, column, query, result, selection, and controller contracts.
- [x] Implement immutable member data and pure search/sort/page queries.
- [ ] Render a native table with complete ARIA grid metadata and safe text.
- [ ] Add delegated selection, sorting, and roving keyboard navigation.
- [ ] Assemble filters, pagination, live feedback, and responsive visual design.
- [ ] Independently verify edge cases, keyboard behavior, and mobile layout.
- [ ] Run actual Lighthouse Accessibility and Best Practices audits.
- [ ] Complete README and truthful per-commit review / failure audit.

## Verification boundaries

- Pure model: Node built-in tests for combinations, ordering, clamping, mutation.
- Browser: native semantics, keyboard, focus retention, empty results, selection.
- Accessibility: contrast and visible focus plus actual Lighthouse reports.
- Documentation: independent static review; browser checks marked N/A.

The checklist records completed work, not planned or inferred test outcomes.
