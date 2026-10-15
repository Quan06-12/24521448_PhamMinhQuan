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