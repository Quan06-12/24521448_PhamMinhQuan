// FICTIONAL case-study data for the lab brief (handles from the assignment).
// It does not describe real events, matches or sanctions.
export const DOSSIERS = [
  {
    playerId: 'himass',
    handle: 'Himass',
    team: 'Saigon Phantom (fictional)',
    game: 'Teamfight Tactics',
    region: 'VN',
    summary: 'Three fictional incidents from an invented regional league season, used to test sanction proportionality.',
    incidents: [
      { code: 'INC-01', date: '2026-09-14', match: 'Week 2 – Lobby B', description: 'Joined the lobby 6 minutes after check-in closed.', severity: 1, matchesBanned: 0, fine: 50 },
      { code: 'INC-02', date: '2026-10-03', match: 'Week 5 – Lobby A', description: 'Unsportsmanlike all-chat message after elimination.', severity: 2, matchesBanned: 3, fine: 200 },
      { code: 'INC-03', date: '2026-10-21', match: 'Playoffs – Round 1', description: 'Unauthorised third-party overlay running on the tournament PC.', severity: 4, matchesBanned: 4, fine: 500 },
    ],
  },
  {
    playerId: 'tanvuu',
    handle: 'TanVuu',
    team: 'Hanoi Arcana (fictional)',
    game: 'Teamfight Tactics',
    region: 'VN',
    summary: 'Two fictional incidents from the same invented season, one of them under appeal in the case study.',
    incidents: [
      { code: 'INC-01', date: '2026-09-28', match: 'Week 4 – Lobby C', description: 'Disconnected twice without notifying the referee.', severity: 2, matchesBanned: 1, fine: 100 },
      { code: 'INC-02', date: '2026-11-02', match: 'Playoffs – Round 2', description: 'Shared lobby information with a teammate in another lobby.', severity: 3, matchesBanned: 6, fine: 800 },
    ],
  },
];