# Independent QA Review — Homework 1

The QA partner reviews each feature before the code partner commits it. Evidence is captured under ignored `evidence/` and remains outside Git. Documentation-only and pure-model commits have no rendered interaction surface; their browser check is explicitly not applicable.

| Slice | Review | Checks | Browser/evidence | Result |
| --- | --- | --- | --- | --- |
| Contracts and project rules (`04cb838`) | QA reviewed before commit | Member/column/query/controller types and ten invariants cover sorting, filters, page clamping, safe rendering, persistent selection, keyboard behavior, and cleanup. Documentation makes no unverified score claim. | Not applicable: documentation-only slice, no rendered UI | Pass |
| Dataset and query model | QA reviewed before commit | Independently ran 14 Node tests; added stable-tie/identity, fractional/nonpositive page bounds, empty-source and frozen-result checks. Source review confirms copy-before-sort and no query mutation. | Not applicable: pure model. `evidence/02-query-tests.txt` | Pass: 14/14 |
| Semantic grid view | Pending | DOM construction and ARIA review | Pending interactive shell | Pending |
| Delegated controller | Pending | Keyboard, sorting, filtering, selection, pagination | Pending interactive shell | Pending |
| Application shell and styling | Pending | Desktop/mobile visual and interaction check | Pending | Pending |
| Regression fixes | Pending | Reproduction and focused retest | Pending | Pending |
| Accessibility audit | Pending | Lighthouse and manual keyboard review | Pending | Pending |
