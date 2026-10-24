# Homework 3 engineering rules

- Scope: only this homework directory; retain the completed exercises.
- Define the module contract before implementation. Review each isolated slice with a separate QA agent before committing it.
- Use ES modules, `const`/`let`, semantic HTML, safe text nodes, root event delegation and explicit cleanup.
- Use a fixed `Date.now()` deadline with `requestAnimationFrame`; never decrement a countdown using timer callback counts.
- Enforce stock conservation after every inventory mutation. Validate caller data at the store boundary.
- Use version checks for reservations, attempt tokens for checkout completion, and request IDs for reservation retries.
- Treat expiry as `now >= expiresAt`. Sale closure expires all outstanding holds. Pending checkout does not extend a hold.
- No unreviewed success claims. Record actual discovered AI defects and reproducible regressions in the audit.
- At least eight meaningful Conventional Commits; ignore generated evidence, dependencies and builds.
- This is an in-memory client simulation. Never imply cross-browser, distributed, payment or security guarantees.
