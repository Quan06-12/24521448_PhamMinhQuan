import { useId, useState } from 'react';
import { SQUAD_STANDINGS } from '../domain/squads.js';
import { KILL_FEED, filterKillFeed } from '../domain/killFeed.js';
import styles from './KillFeed.module.css';

// Squad id -> name, built once; the feed only stores ids
const NAME_BY_ID = new Map(SQUAD_STANDINGS.map((s) => [s.squadId, s.squadName]));

export function KillFeed() {
  const filterId = useId();
  const [squadId, setSquadId] = useState('all');
  const entries = filterKillFeed(KILL_FEED, squadId);

  return (
    <section className={styles.section} aria-labelledby="killfeed-heading">
      <h2 id="killfeed-heading">Kill feed</h2>
      <div className={styles.field}>
        <label htmlFor={filterId}>Squad</label>
        <select id={filterId} value={squadId} onChange={(e) => setSquadId(e.target.value)}>
          <option value="all">All squads</option>
          {SQUAD_STANDINGS.map((s) => (
            <option key={s.squadId} value={s.squadId}>{s.squadName}</option>
          ))}
        </select>
      </div>
      <output className={styles.count} aria-live="polite">
        {entries.length} {entries.length === 1 ? 'elimination' : 'eliminations'}
      </output>
      <ul className={styles.list} role="list">
        {entries.map((e) => (
          <li key={e.id} className={styles.item}>
            <time className={styles.clock}>{e.clock}</time>
            <span>
              <strong>{NAME_BY_ID.get(e.killerSquadId)}</strong> eliminated{' '}
              <strong>{NAME_BY_ID.get(e.victimSquadId)}</strong> with {e.weapon}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
