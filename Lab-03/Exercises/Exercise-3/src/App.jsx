import { useState } from 'react';
import { PUBG_VN_SQUADS } from './data/pubgSquads.js';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import styles from './App.module.css';

// App shell for Exercise 3 – KRAFTON PUBG VN Live Match Telemetry
export default function App() {
  const [squadId, setSquadId] = useState(null); // null = IDLE

  return (
    <main className={styles.app}>
      <h1 className={styles.title}>PUBG VN Match Telemetry</h1>

      <section className={styles.panel} aria-labelledby="squads-heading">
        <h2 id="squads-heading" className={styles.panelTitle}>Squads</h2>
        {/* role="list": Safari drops list semantics when list-style is none */}
        <ul className={styles.squads} role="list">
          {PUBG_VN_SQUADS.map((squad) => (
            <li key={squad.id}>
              <button
                type="button"
                className={styles.squadButton}
                aria-pressed={squad.id === squadId}
                onClick={() => setSquadId(squad.id)}
              >
                <strong>{squad.tag}</strong>
                <small>{squad.name}</small>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.panel} aria-labelledby="radar-heading">
        <h2 id="radar-heading" className={styles.panelTitle}>Live radar</h2>
        {/* key={squadId}: new squad = new component instance, old request aborted */}
        <PubgMatchTelemetry key={squadId ?? 'idle'} squadId={squadId} />
      </section>
    </main>
  );
}