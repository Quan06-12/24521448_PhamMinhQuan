# Homework 2 — AI failure audit

Only observed findings are listed.

| # | AI output | Bug observed | Detection | Fix |
|---|---|---|---|---|
| 1 | Draggable card CSS without overflow handling | At 375px, dragging the card past the right edge pushed it outside the deck and could create a horizontal scrollbar | DevTools device mode (iPhone SE), screenshot while dragging | Added `overflow-x: clip` on `.deck`; `scrollWidth` stays 375 while the card is dragged 300px |
| 2 | Default Vite preview command for the Lighthouse run | `npm run preview` serves on port 4173, but the API only allows CORS from 5173, so the production build could not load data | Reviewing the CORS origin before running Lighthouse | Run `npm run preview -- --port 5173 --strictPort` |

Not an AI bug but worth recording: the official Mongoose compatibility table lists MongoDB up to 8.x;
MongoDB 9.0.8 with mongoose 8.24.11 connected and passed every check in this homework.