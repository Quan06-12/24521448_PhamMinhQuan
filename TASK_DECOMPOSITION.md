# Homework 1 - Task Decomposition

## Project
Production Developer Portfolio

## Goal
Build a responsive, accessible, and secure
developer portfolio using Vanilla HTML,
CSS, and JavaScript.

## Work Breakdown Structure

### T-00: Project Preparation
- Define project rules.
- Define task decomposition.
- Initialize Git.

### T-01: Semantic HTML
- Create HTML5 boilerplate.
- Add skip link.
- Build semantic landmarks.
- Use exactly one h1.
- Avoid div elements.

### T-02: CSS Foundations
- Create CSS variables.
- Apply CSS reset.
- Define light theme colors.

### T-03: Responsive Layout
- Use Flexbox for navigation.
- Use CSS Grid for projects.
- Support 375px mobile screens.

### T-04: Theme Engine
- Implement dark mode.
- Store theme in localStorage.
- Update aria-pressed.

### T-05: Accessibility
- Audit landmarks and contrast.
- Test keyboard navigation.
- Prevent keyboard focus traps.

### T-06: Security and Performance
- Apply a strict CSP.
- Remove inline event handlers.
- Audit using Lighthouse.
- Optimize assets.

## Homework 2 - Drum Kit Engine

### T-01: HTML Data Contract
- Create semantic HTML structure.
- Create drum pads using button elements.
- Define data-key attributes.
- Define data-sound attributes.

### T-02: Audio Engine
- Implement polyphonic audio playback.
- Handle audio loading errors.
- Keep audio logic independent from UI.

### T-03: Keyboard Events
- Use keydown and event.key.
- Prevent repeated key events.
- Support mouse click.

### T-04: FIFO Beat Recorder
- Record drum events and timestamps.
- Preserve event order.
- Replay recorded beats.
- Implement stop functionality.

### T-05: Verification
- Test keyboard and mouse controls.
- Test multiple simultaneous sounds.
- Test recording and replay.
- Verify key binding can be modified.
# Homework 3 - Resilient Event Hub

## Project Goal
Build a responsive event landing page with a
drift-free countdown, resilient registration form,
and secure input handling.

## Task Breakdown

### T-00: Project Planning
- Define architecture and project contracts.
- Define independent implementation tasks.
- Document expected component states.

### T-01: Semantic HTML
- Create the event landing page.
- Add event information and countdown display.
- Create an accessible registration form.
- Define IDs for JavaScript integration.

### T-02: Countdown Engine
- Use UTC ISO 8601 timestamps.
- Calculate remaining time with Date.now().
- Prevent cumulative timer drift.
- Handle expired events.

### T-03: Form State Machine
- Define idle, submitting, success and error.
- Implement state transitions.
- Display accessible feedback messages.

### T-04: Security
- Prevent duplicate submissions.
- Validate registration inputs.
- Avoid unsafe innerHTML usage.
- Handle asynchronous failures.

### T-05: Testing and AI Audit
- Test countdown accuracy