// Initial drops. Times are relative to page load so a tester always sees
// one drop already live, one opening in ~20 s and one in ~2 min.
// The last-circle crate gets a 90 s window and opened 30 s ago, so it
// expires about 60 s after load if nobody grabs it.
// Computed once at module load (not in render) to keep components pure.
const LOADED_AT = Date.now();
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const LONG_WINDOW_MS = 30 * MINUTE;

/** @type {ReadonlyArray<import('./contracts.js').PubgCrateDrop>} */
export const INITIAL_DROPS = Object.freeze([
  {
    id: 'vip-finals-pass',
    title: 'PVS Grand Finals VIP Pass + 5,000 G-Coin',
    priceVnd: 1490000,
    remainingStock: 3,
    dropEpochMs: LOADED_AT + 20 * SECOND,
    claimWindowMs: LONG_WINDOW_MS,
  },
  {
    id: 'gcoin-contraband-crate',
    title: 'G-Coin Contraband Crate',
    priceVnd: 99000,
    remainingStock: 12,
    dropEpochMs: LOADED_AT - 60 * SECOND,
    claimWindowMs: LONG_WINDOW_MS,
  },
  {
    id: 'standard-finals-ticket',
    title: 'Standard Grand Finals Ticket',
    priceVnd: 350000,
    remainingStock: 8,
    dropEpochMs: LOADED_AT + 120 * SECOND,
    claimWindowMs: LONG_WINDOW_MS,
  },
  {
    id: 'last-circle-crate',
    title: 'Last Circle Mini Crate (final stock)',
    priceVnd: 29000,
    remainingStock: 1,
    dropEpochMs: LOADED_AT - 30 * SECOND,
    claimWindowMs: 90 * SECOND,
  },
]);
