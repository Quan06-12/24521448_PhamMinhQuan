import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../api/fetchKraftonPubgTelemetry.js';

// The 4 states of the machine (Lab 2 ViewState<T>): exactly one is active at a time
const IDLE_VIEW = { status: 'IDLE', data: null, error: null };
const LOADING_VIEW = { status: 'LOADING', data: null, error: null };

/**
 * Live telemetry for one squad: IDLE | LOADING | SUCCESS | ERROR.
 * The parent renders it with key={squadId}, so switching squads remounts it:
 * the old effect's cleanup aborts the stale request and state starts fresh.
 * @param {{ squadId: string | null }} props
 */
export function PubgMatchTelemetry({ squadId }) {
  // Initial state comes from props (no setState needed inside the effect body)
  const [view, setView] = useState(() => (squadId ? LOADING_VIEW : IDLE_VIEW));

  useEffect(() => {
    if (!squadId) return undefined; // IDLE: nothing to synchronise

    const controller = new AbortController();
    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => setView({ status: 'SUCCESS', data, error: null }))
      .catch((err) => {
        // Intentional abort (squad switched / unmounted) is not an error
        if (err.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err.message });
      });

    // Cleanup: cancel the in-flight request on squad switch, unmount or StrictMode re-run
    return () => controller.abort();
  }, [squadId]);

  if (view.status === 'IDLE') {
    return <p>Choose a squad to open its live radar.</p>;
  }
  if (view.status === 'LOADING') {
    return <p role="status">Syncing KRAFTON radar…</p>;
  }
  if (view.status === 'ERROR') {
    return <p>Blue-Zone link lost: {view.error}</p>;
  }

  const { data } = view;
  return (
    <article aria-labelledby="squad-title">
      <h3 id="squad-title">{data.name}</h3>
      <dl>
        <dt>Map</dt><dd>{data.map}</dd>
        <dt>Phase</dt><dd>{data.phase}</dd>
        <dt>Alive</dt><dd>{data.alive} / 4</dd>
        <dt>Kills</dt><dd>{data.kills}</dd>
        <dt>WWCD chance</dt><dd>{data.wwcdProb}</dd>
        <dt>Status</dt><dd>{data.status}</dd>
      </dl>
    </article>
  );
}