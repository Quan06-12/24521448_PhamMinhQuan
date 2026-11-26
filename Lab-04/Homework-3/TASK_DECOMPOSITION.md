# Homework 3 — work breakdown

Each slice follows contract → isolated implementation → verification → commit.
Screenshots are included in the submitted Word report, never in Git.

- [x] Step 0 – Folder structure and docs
- [ ] Step 1 – Server: `Dossier` + `Appeal` models, seed, `GET /api/dossiers`, `POST /api/appeals` with a server-owned SLA deadline
- [ ] Step 2 – Client router: layout, `/dossier/:playerId`, 404 for unknown players
- [ ] Step 3 – `DossierView` with a disproportionality matrix derived during render
- [ ] Step 4 – Context-driven appeal form with real-time validation, submitted to the API
- [ ] Step 5 – `useAppealSlaTimer`: zero-drift countdown against the system clock + Page Visibility resync
- [ ] Step 6 – Accessibility pass, Lighthouse, README, AI failure post-mortem