// Initial drops. Times are relative to page load so a tester always sees
// one drop already live, one opening in ~20 s and one in ~2 min.
// Computed once at module load (not in render) to keep components pure.
const LOADED_AT = Date.now();
const SECOND = 1000;

/** @type {ReadonlyArray<import('./contracts.js').PubgCrateDrop>} */
export const INITIAL_DROPS = Object.freeze([
  {
    id: 'vip-finals-pass',
    title: 'PVS Grand Finals VIP Pass + 5,000 G-Coin',
    priceVnd: 1490000,
    remainingStock: 3,
    dropEpochMs: LOADED_AT + 20 * SECOND,
  },
  {
    id: 'gcoin-contraband-crate',
    title: 'G-Coin Contraband Crate',
    priceVnd: 99000,
    remainingStock: 12,
    dropEpochMs: LOADED_AT - 60 * SECOND,
  },
  {
    id: 'standard-finals-ticket',
    title: 'Standard Grand Finals Ticket',
    priceVnd: 350000,
    remainingStock: 8,
    dropEpochMs: LOADED_AT + 120 * SECOND,
  },
  {
    id: 'last-circle-crate',
    title: 'Last Circle Mini Crate (final stock)',
    priceVnd: 29000,
    remainingStock: 1,
    dropEpochMs: LOADED_AT - 30 * SECOND,
  },
]);
