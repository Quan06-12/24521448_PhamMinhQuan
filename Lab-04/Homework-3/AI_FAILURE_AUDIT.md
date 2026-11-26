# Homework 3 — AI failure audit (post-mortem)

Only observed findings are listed.

| # | AI output | Bug observed | Detection | Fix |
| 1 | Layout CSS with `.link:hover` declared alongside `.active` (also used in HW1) | Hovering the active NavLink applied the grey hover background with the dark active text → unreadable label | Screenshot right after clicking a dossier link (pointer still over it) | `.active, .active:hover { … }` so the active colours win; fixed in HW1 and HW3 |