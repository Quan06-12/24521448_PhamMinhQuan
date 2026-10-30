# Exercise 1 — Semantic Engineer & Pro-Gamer Profile Card

React 19 `<DeveloperCard />` and `<SkillBadge />` built with zero `<div>` tags.

## Scope

- `<article aria-labelledby>` + `<header>` + `<hgroup>`; heading id from `useId()`
  so multiple cards never share an id.
- Metrics rendered as `<dl>` with `<Fragment key>` pairs (`Object.entries`).
- Skills rendered as `<ul>` of `<SkillBadge>` items with stable `key={skill.id}`.
- ES6 default parameters (no `defaultProps`); default objects are module constants.
- HTTPS-only avatar with explicit `width`/`height`; initials fallback on load error.
- CSS Modules + custom properties; cards stack at 375px with no horizontal scroll.

## Run locally

```sh
npm install
npm run dev
```

## Verification (Checkpoint 1)

| Check | Result |
|---|---|
| `Select-String ... DeveloperCard.jsx -Pattern "<div"` | 0 matches |
| `Select-String ... DeveloperCard.jsx -Pattern "http://"` | 0 matches |
| 375px: cards stack, long role text wraps, no horizontal scroll | Pass |
| Broken avatar URL shows "PQ" initials (same 64×64 box) | Pass |
| Two cards render with different heading ids | Pass |

Screenshots are included in the submitted Word report.