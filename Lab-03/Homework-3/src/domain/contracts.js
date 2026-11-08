// Domain contracts for the arena. Plain JS, so the shapes live in JSDoc typedefs.

/**
 * Lifecycle of a drop. It is always derived (see getDropPhase), never stored.
 * @typedef {'WARMUP' | 'AIRDROP_LIVE' | 'LOOTED_OUT' | 'EXPIRED'} DropPhase
 */

/**
 * @typedef {Object} PubgCrateDrop
 * @property {string} id
 * @property {string} title
 * @property {number} priceVnd
 * @property {number} remainingStock
 * @property {number} dropEpochMs - absolute time (ms since epoch) when the drop opens
 */

/**
 * @typedef {Object} PubgVnSquadStanding
 * @property {string} squadId - 'te' | 'ces' | 'ge' | 'agg' ...
 * @property {string} squadName
 * @property {number} wwcdCount
 * @property {number} placementPts
 * @property {number} killPts
 */

/**
 * @typedef {Object} KillFeedEntry
 * @property {string} id
 * @property {string} killerSquadId
 * @property {string} victimSquadId
 * @property {string} weapon
 * @property {string} clock - match clock, e.g. "12:41"
 */

export const DROP_PHASE = Object.freeze({
  WARMUP: 'WARMUP',
  AIRDROP_LIVE: 'AIRDROP_LIVE',
  LOOTED_OUT: 'LOOTED_OUT',
  EXPIRED: 'EXPIRED',
});

/**
 * Phase is a pure function of the countdown and the stock.
 * LOOTED_OUT wins over WARMUP only after the countdown ended, so a sold-out
 * drop that has not opened yet still reads as a warm-up.
 * @param {number} remainingMs
 * @param {number} remainingStock
 * @returns {DropPhase}
 */
export function getDropPhase(remainingMs, remainingStock) {
  if (remainingMs > 0) return DROP_PHASE.WARMUP;
  return remainingStock > 0 ? DROP_PHASE.AIRDROP_LIVE : DROP_PHASE.LOOTED_OUT;
}

/** Total tournament points of a squad (derived, never stored). */
export function totalPoints(squad) {
  return squad.placementPts + squad.killPts;
}
