# Lab 02 – Project Rules

## 1. Coding Standards
- Use `const` and `let` instead of `var`.
- Use Semantic HTML elements such as `main`, `header`, `section`, and `button`.
- Use JavaScript ES Modules with `import` and `export`.
- Keep functions small and focused on one responsibility.

## 2. DOM and Security
- Use `document.createElement()` for HTML elements.
- Use `document.createTextNode()` for text content.
- Avoid raw `innerHTML` with untrusted input to prevent XSS.
- Use `addEventListener()` instead of inline HTML event handlers.

## 3. Virtual DOM Architecture
- Represent Virtual Nodes using JavaScript objects.
- Implement `createTextElement()`, `createElement()`, and `renderToDOM()`.
- Keep the VNode structure consistent.
- Use recursive rendering for nested elements.

## 4. AI-Assisted Development
- Divide requirements into small, independent tasks.
- Verify AI-generated code before accepting it.
- Test functionality using browser DevTools.
- Document AI-generated errors and their corrections.

## 5. Git Workflow
- Use Conventional Commits.
- Commit individual features separately.
- Verify changes with `git diff` and `git status`.
- Do not commit broken or untested code.


## 6. Homework verification and evidence
- Homework folders are `Lab-02/Homework-1`, `Homework-2` and `Homework-3`.
- Define contracts before implementing each isolated module.
- Obtain independent QA review before accepting each implementation commit.
- Store screenshots, local test logs and Lighthouse artifacts in the homework's ignored `evidence/` directory; never force-add evidence to Git.
- Distinguish unit/static checks from real-browser checks and DevTools captures.
- Record only observed defects and actual verification results in `AI_FAILURE_AUDIT.md`.
- Do not mark browser, Lighthouse or assistive-technology checks complete without actual results.
