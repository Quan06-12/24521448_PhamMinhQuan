/** @type {ReadonlyArray<import('./contracts.js').KillFeedEntry>} */
export const KILL_FEED = Object.freeze([
  { id: 'k1', killerSquadId: 'te', victimSquadId: 'agg', weapon: 'M416', clock: '21:48' },
  { id: 'k2', killerSquadId: 'ge', victimSquadId: 'roy', weapon: 'Kar98k', clock: '21:12' },
  { id: 'k3', killerSquadId: 'ces', victimSquadId: 'hr', weapon: 'Beryl M762', clock: '20:37' },
  { id: 'k4', killerSquadId: 'roy', victimSquadId: 'sp', weapon: 'AWM', clock: '19:55' },
  { id: 'k5', killerSquadId: 'agg', victimSquadId: 'ge', weapon: 'SCAR-L', clock: '19:20' },
  { id: 'k6', killerSquadId: 'te', victimSquadId: 'ces', weapon: 'Mini14', clock: '18:44' },
  { id: 'k7', killerSquadId: 'ge', victimSquadId: 'sp', weapon: 'AKM', clock: '18:03' },
  { id: 'k8', killerSquadId: 'ces', victimSquadId: 'agg', weapon: 'Vector', clock: '17:29' },
]);

/**
 * Entries where the squad is the killer or the victim ('all' keeps everything).
 * @param {ReadonlyArray<import('./contracts.js').KillFeedEntry>} feed
 * @param {string} squadId
 */
export function filterKillFeed(feed, squadId) {
  if (squadId === 'all') return feed;
  return feed.filter((e) => e.killerSquadId === squadId || e.victimSquadId === squadId);
}
