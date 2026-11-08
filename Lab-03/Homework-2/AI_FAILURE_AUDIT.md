# Homework 2 — AI failure audit

Only defects actually observed are listed. Screenshots are included in the
submitted Word report.

## Failure #01: Render counter shipped in the production build

- **Prompt**: "Make the memo isolation observable so one key press can be shown to
  re-render only that key."
- **AI Code**: every `PianoKey` incremented a counter in an effect and wrote it to a
  `data-renders` attribute on its button, unconditionally.
- **Bug**: the counter is a development aid, but it was bundled into `npm run build`,
  so production paid one DOM write per key commit and exposed a debug attribute on
  all 88 buttons.
- **DevTools Proof**: every key button carried a `data-renders` value in the DOM during
  browser testing, and the code wrote it with no development-only guard.
- **Engineering Fix (Commit dffbe49)**: the counter now runs only when
  `import.meta.env.DEV` is true; a search of the new `dist/` output finds no
  `data-renders`, and the memo check still works in development.

No other defects were found: functional browser tests (key table, FIFO stealing,
replay timing, Stop Sequence, keyboard input, 375px layout) all passed, and ESLint,
the build and the banned-API search were clean before every commit.
