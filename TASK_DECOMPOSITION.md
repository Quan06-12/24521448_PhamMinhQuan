# Task Decomposition

## T-01: Semantic DOM Architecture & A11y Contract

### Requirements
- Build the semantic landmark hierarchy.
- Use 0 `<div>` elements.
- Add an accessible skip link to the main content.
- Use semantic elements: `header`, `nav`, `main`, and `section`.
- Verify the landmark tree using Chrome DevTools Accessibility.
## T-02A: Tokens & Reset

- Define reusable CSS design tokens.
- Define colors using CSS variables.
- Add a basic CSS reset.
- Do not use hardcoded colors inside CSS rules.
## T-02B: Responsive Grid

- Build the page layout using CSS Grid.
- Create a desktop two-column layout.
- Adapt the layout for mobile screens.
- Ensure there is no horizontal scrolling at 375px width.
## T-02C: Theme Engine

- Implement Dark and Light theme switching.
- Store theme state using localStorage key `theme`.
- Restore the selected theme after page reload.
- Support keyboard interaction for the theme button.
- Ensure zero console errors during theme toggling.
## T-03A: Hero Section

- Create a semantic hero section.
- Add a high-resolution portrait with explicit width and height.
- Add a headline and short personal pitch.
## T-03B: Accessible Theme Switcher

- Add `aria-pressed` state to the theme button.
- Change the icon and label based on the active theme.
- Preserve theme state using `localStorage`.
- Support keyboard interaction.
- Ensure zero console errors.
## T-03C: Skills Matrix

- Create categorized skill groups.
- Display skills using CSS Grid.
- Keep the layout responsive on mobile devices.
## T-03D: Project Cards

- Create reusable project cards using semantic `article` elements.
- Add project title, technology badge, description, and source link.
- Use `data-category` to classify projects.
- Keep the cards responsive using CSS Grid.
## T-03E: Contact Form

- Create an accessible contact form.
- Use labels connected to each input.
- Validate required fields on the client side.
- Provide clear validation feedback.
- Handle form submission without reloading the page.
# Exercise 4: Resilient Component Architecture

## Component State Machine

The project component supports four states:

- Loading: Display a skeleton placeholder while data is loading.
- Live: Display project data normally.
- Empty: Display a message when no project data is available.
- Error: Display an accessible error message with a retry action.

State flow:

Loading -> Live
Loading -> Empty
Loading -> Error
Error -> Loading
## T-04A: Loading Skeleton

- Create a pure CSS shimmer skeleton.
- Display placeholder content while project data is loading.
- Do not require JavaScript animation.

## T-04B: Live Data State

- Render project metadata.
- Display project badges.
- Display projects using a responsive CSS Grid.

## T-04C: Empty and Error States

- Display a clear empty-state message.
- Display an accessible error message.
- Provide a Retry button for the error state.