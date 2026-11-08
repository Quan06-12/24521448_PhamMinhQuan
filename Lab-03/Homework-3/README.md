# Homework 3 — KRAFTON x PUBG Vietnam Championship & Airdrop Arena

React 19 + Vite "PVS Finals Ticket & G-Coin Contraband Crate Arena", evolving
Lab 2 HW3's anti-drift timer into a zero-drift countdown hook, an optimistic
claim flow with 409 rollback, and a derived squad leaderboard.

## Scope

- Domain contracts (JSDoc): `DropPhase`, `PubgCrateDrop`, `PubgVnSquadStanding`.
- `usePubgAirdropTimer(targetEpochMs, serverOffsetMs)`: state is the wall clock,
  remaining time is `Math.max(0, target - (now + offset))` derived in render; a
  250 ms tick plus an immediate resync on `visibilitychange`, so hidden tabs never drift.
- Drop phase derived per card: WARMUP → AIRDROP_LIVE → LOOTED_OUT, or EXPIRED when
  the claim window closes with stock left.
- Optimistic claim: per-drop in-flight lock (a ref, so same-tick double clicks are
  blocked), stock − 1 immediately, server reconciliation on success, automatic
  rollback on 409 ("Looted out — stock restored") or on a network failure
  ("Claim failed — stock restored, try again"). Pending claims abort on unmount.
- Prices in VND via `Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`.
- Leaderboard `<table>` with search, minimum-WWCD filter and sort by total, WWCD,
  placement or kills (deterministic tie-breaks, `aria-sort` on the sorted header),
  plus a kill feed filtered by squad. All filtering is derived during render.
- Test flags on the mock server: `?conflict=1` always 409, `?conflict=0` never sniped
  (a real sell-out still 409s), `?fail=1` simulates a network error.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build
```

## Architecture

| File | Responsibility |
|---|---|
| `src/domain/contracts.js` | JSDoc typedefs for the slide's domain contract and the pure phase derivation |
| `src/domain/drops.js`, `squads.js`, `killFeed.js` | Sample drops (relative to page load), squad standings, eliminations |
| `src/domain/leaderboard.js`, `format.js` | Pure sort / filter helpers; VND and countdown formatting |
| `src/hooks/usePubgAirdropTimer.js` | Zero-drift countdown with visibility resync and cleanup |
| `src/hooks/useDropClaims.js` | Optimistic stock, in-flight lock, rollback, notices, abort on unmount |
| `src/api/claimDrop.js` | Mock claim endpoint with latency, authoritative stock, 409 and failure modes |
| `src/components/DropCard.jsx` | Price, stock, phase, `<time>` countdown, claim button |
| `src/components/ClaimNotice.jsx` | Polite status for results, `role="alert"` for failures |
| `src/components/Leaderboard.jsx`, `KillFeed.jsx` | Derived tables with labelled controls and live counts |

## Verification status

| Check | Result |
|---|---|
| VIP pass countdown | WARMUP → AIRDROP_LIVE at 20.4 s after load; `mm:ss`, never negative |
| Anti-drift | Clock jumped +90 s with timers paused: display unchanged until `visibilitychange`, then corrected immediately (01:59 → 00:30) |
| Optimistic claim (`?conflict=0`) | Stock 12 → 11 at click, "Claiming…" and disabled; triple click claims once |
| 409 rollback (`?conflict=1`) | 12 → 11 → 12, "Looted out — stock restored", button usable again |
| 1-stock crate | Claimed → LOOTED_OUT, button disabled |
| Claim window | Last Circle crate EXPIRED at 60.1 s after load, button "Claim window closed" (disabled) |
| Network failure (`?fail=1`) | 12 → 11 → 12, `role="alert"` "Claim failed — stock restored, try again", no unhandled rejection |
| Drop grid at 1280 x 800 | 2 x 2 |
| Leaderboard | All four sorts match an independent comparator; `aria-sort` only on the sorted column |
| Unmount during a claim | No console errors |
| 375 x 667 | Page `scrollWidth` 375; the table scrolls inside its wrapper |
| `npx eslint src` / `npx vite build` | 0 problems / success |

Two squads in the sample table (Hanoi Raiders, Saigon Phantom) are invented to fill
the leaderboard. Screenshots are included in the submitted Word report.
