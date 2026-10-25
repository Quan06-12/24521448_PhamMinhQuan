# Lab 02 consolidated AI failure audit

Only observed findings are listed. Source review, deterministic tests and actual browser reproduction are distinguished in the linked detailed records. Screenshots and local test/Lighthouse outputs are stored in ignored evidence folders and delivered separately.

| Homework | Finding | Correction and verification |
| --- | --- | --- |
| 1 | Unconditional pagehide cleanup could leave a restored page without listeners | Respect persisted pagehide; actual-entry lifecycle simulation passes. Actual BFCache restoration was not established. |
| 1 | Unselected control boundary contrast was about 2.20:1 | Darken border to about 3.75:1; source calculation and actual computed style verified. |
| 1 | A focused pagination button becoming disabled dropped focus to BODY | Transfer focus to the opposite enabled direction or page-size fallback; native keyboard regression verified. |
| 1 | Rightmost focused cell content stayed clipped in the narrow grid | Scroll only focused cells to nearest visibility; actual 390px iframe and regression tests verify visibility without stealing input focus. |
| 2 | Static server root returned 403 because normalized and trailing-slash paths differed | Normalize the root and retain containment checks; executed HTTP regression and real browser loading pass. |
| 3 | Invalid injected clock samples created immortal holds or NaN RAF loops | Reject non-finite clock samples and stop scheduling; narrowly scoped deterministic regressions pass. Native Date.now was not observed returning NaN. |
| 3 | Rejected checkout consumed an expiry transition without notifying the view | Notify the observer on failed checkout start; formerly failing regression passes. |
| 3 | Disabling focused checkout dropped keyboard focus before terminal handoff | Move focus to Cancel payment before disabling; native browser verifies the chain to the bag heading on completion/expiry. |

A separate qualified HW3 boundary-consistency weakness involved reading the clock multiple times inside one synchronous operation. One validated timestamp now supplies a consistent linearization point. This observation is not evidence of overselling and is not presented as another catastrophic defect.

Detailed reproductions, fixes, evidence types and limitations:

- [Homework 1 audit](Homework-1/AI_FAILURE_AUDIT.md)
- [Homework 2 audit](Homework-2/AI_FAILURE_AUDIT.md)
- [Homework 3 audit](Homework-3/AI_FAILURE_AUDIT.md)

## Verification boundaries

All 75 unified Node tests passed after integration. Homework 1's final actual Lighthouse report scored 100 Accessibility and 100 Best Practices with source hashes unchanged before and after the audit. Three projects passed the documented real-browser functional checks and narrow iframe layouts. Native DevTools-panel screenshots, complete assistive-technology review and physical-device testing were not captured. Homework 2's measured cloud cadence was about 2.41fps, so the 60fps performance target remains unverified.
