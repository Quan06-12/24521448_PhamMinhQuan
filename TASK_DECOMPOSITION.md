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