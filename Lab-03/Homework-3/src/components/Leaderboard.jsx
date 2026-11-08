import { useId, useState } from 'react';
import { SQUAD_STANDINGS } from '../domain/squads.js';
import { SORT_OPTIONS, selectStandings } from '../domain/leaderboard.js';
import { totalPoints } from '../domain/contracts.js';
import styles from './Leaderboard.module.css';

export function Leaderboard() {
  const searchId = useId();
  const sortId = useId();
  const minId = useId();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('total');
  const [minWwcdText, setMinWwcdText] = useState('0');

  // Everything below is derived during render, no effect and no copied state
  const minWwcd = Math.max(0, Number.parseInt(minWwcdText, 10) || 0);
  const rows = selectStandings(SQUAD_STANDINGS, { query, minWwcd, sortKey });
  // Sort option keys match the column names, so the sorted header is just sortKey
  const ariaSort = (column) => (column === sortKey ? 'descending' : undefined);

  return (
    <section className={styles.section} aria-labelledby="leaderboard-heading">
      <h2 id="leaderboard-heading">PUBG VN leaderboard</h2>

      <form className={styles.controls} onSubmit={(e) => e.preventDefault()}>
        <fieldset className={styles.fieldset}>
          <legend>Filter and sort squads</legend>
          <div className={styles.field}>
            <label htmlFor={searchId}>Search squad</label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Cerberus"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={sortId}>Sort by</label>
            <select id={sortId} value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor={minId}>Minimum WWCD</label>
            <input
              id={minId}
              type="number"
              min="0"
              inputMode="numeric"
              value={minWwcdText}
              onChange={(e) => setMinWwcdText(e.target.value)}
            />
          </div>
        </fieldset>
      </form>

      <output className={styles.count} aria-live="polite">
        Showing {rows.length} of {SQUAD_STANDINGS.length} squads
      </output>

      {/* The wrapper scrolls on small screens, so the page itself never does */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>Squad standings, highest first</caption>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Squad</th>
              <th scope="col" aria-sort={ariaSort('wwcd')}>WWCD</th>
              <th scope="col" aria-sort={ariaSort('placement')}>Placement</th>
              <th scope="col" aria-sort={ariaSort('kills')}>Kills</th>
              <th scope="col" aria-sort={ariaSort('total')}>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((squad, index) => (
              <tr key={squad.squadId}>
                <td>{index + 1}</td>
                <th scope="row">{squad.squadName}</th>
                <td>{squad.wwcdCount}</td>
                <td>{squad.placementPts}</td>
                <td>{squad.killPts}</td>
                <td>{totalPoints(squad)}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6}>No squad matches these filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
