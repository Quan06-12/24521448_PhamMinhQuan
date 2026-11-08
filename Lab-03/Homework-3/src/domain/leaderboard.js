import { totalPoints } from './contracts.js';

export const SORT_OPTIONS = Object.freeze([
  { key: 'total', label: 'Total points' },
  { key: 'wwcd', label: 'WWCD' },
  { key: 'placement', label: 'Placement points' },
  { key: 'kills', label: 'Kill points' },
]);

// Each option sorts by its main value first, then falls back to the tie-breakers in order.
// The squad name is the last resort so equal rows never swap places between renders.
const COMPARATORS = {
  total: (a, b) =>
    totalPoints(b) - totalPoints(a) || b.wwcdCount - a.wwcdCount || b.placementPts - a.placementPts,
  wwcd: (a, b) =>
    b.wwcdCount - a.wwcdCount || totalPoints(b) - totalPoints(a) || b.placementPts - a.placementPts,
  placement: (a, b) =>
    b.placementPts - a.placementPts || totalPoints(b) - totalPoints(a) || b.wwcdCount - a.wwcdCount,
  kills: (a, b) =>
    b.killPts - a.killPts || totalPoints(b) - totalPoints(a) || b.wwcdCount - a.wwcdCount,
};

/**
 * Filter then sort. Returns a new array and never touches the input.
 * @param {ReadonlyArray<import('./contracts.js').PubgVnSquadStanding>} squads
 * @param {{ query: string, minWwcd: number, sortKey: keyof typeof COMPARATORS }} options
 */
export function selectStandings(squads, { query, minWwcd, sortKey }) {
  const needle = query.trim().toLowerCase();
  const compare = COMPARATORS[sortKey] ?? COMPARATORS.total;
  return squads
    .filter((s) => s.wwcdCount >= minWwcd)
    .filter((s) => s.squadName.toLowerCase().includes(needle))
    .sort((a, b) => compare(a, b) || a.squadName.localeCompare(b.squadName));
}
