import { useState } from 'react';
import { PUBG_VN_SQUADS } from './data/pubgSquads.js';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';

// App shell for Exercise 3 – KRAFTON PUBG VN Live Match Telemetry
export default function App() {
  const [squadId, setSquadId] = useState(null); // null = IDLE

  return (
    <main>
      <h1>PUBG VN Match Telemetry</h1>

      <section aria-labelledby="squads-heading">
        <h2 id="squads-heading">Squads</h2>
        <ul>
          {PUBG_VN_SQUADS.map((squad) => (
            <li key={squad.id}>
              <button
                type="button"
                aria-pressed={squad.id === squadId}
                onClick={() => setSquadId(squad.id)}
              >
                {squad.name} ({squad.tag})
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="radar-heading">
        <h2 id="radar-heading">Live radar</h2>
        {/* key={squadId}: new squad = new component instance, old request aborted */}
        <PubgMatchTelemetry key={squadId ?? 'idle'} squadId={squadId} />
      </section>
    </main>
  );
}