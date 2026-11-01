import { useEffect, useRef, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../api/fetchKraftonPubgTelemetry.js';
import styles from './PubgMatchTelemetry.module.css';

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
  const [retryTick, setRetryTick] = useState(0); // bumping it re-runs the effect
  const frameRef = useRef(null);

  useEffect(() => {
    if (!squadId) return undefined; // IDLE: nothing to synchronise

    const controller = new AbortController();
    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => setView({ status: 'SUCCESS', data, error: null }))
      .catch((err) => {
        // Intentional abort (squad switched / unmounted / retry) is not an error
        if (err.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err.message });
      });

    // Cleanup: cancel the in-flight request on squad switch, retry, unmount or StrictMode re-run
    return () => controller.abort();
  }, [squadId, retryTick]);

  const handleRetry = () => {
    // The Retry button disappears in LOADING: park focus on the persistent frame first
    frameRef.current?.focus();
    setView(LOADING_VIEW);          // event handler, not effect body: no cascading render
    setRetryTick((tick) => tick + 1);
  };

  const isLoading = view.status === 'LOADING';

  return (
    // Same frame element in every state: stable 220px box and a stable focus target
    <section
      ref={frameRef}
      tabIndex={-1}
      className={styles.frame}
      aria-label="Squad radar"
      aria-busy={isLoading}
    >
      {view.status === 'IDLE' && (
        <p className={styles.idle}>Choose a squad to open its live radar.</p>
      )}

      {isLoading && (
        <>
          {/* Decorative bars hidden from screen readers; the status text is announced */}
          <span className={`${styles.skeletonBar} ${styles.skeletonTitle}`} aria-hidden="true" />
          <span className={styles.skeletonBar} aria-hidden="true" />
          <span className={styles.skeletonBar} aria-hidden="true" />
          <span className={`${styles.skeletonBar} ${styles.skeletonShort}`} aria-hidden="true" />
          <p className={styles.syncing} role="status">Syncing KRAFTON radar…</p>
        </>
      )}

      {view.status === 'ERROR' && (
        // role="alert" replaces the banned blocking browser dialog: announced, non-blocking
        <section className={styles.alert} role="alert">
          <p><strong>Blue-Zone link lost:</strong> {view.error}</p>
          <button type="button" className={styles.retry} onClick={handleRetry}>
            Reconnect Satellite (Retry)
          </button>
        </section>
      )}

      {view.status === 'SUCCESS' && (
        <article className={styles.card} aria-labelledby="squad-title">
          <h3 id="squad-title" className={styles.squadName}>{view.data.name}</h3>
          <dl className={styles.stats}>
            <dt>Map</dt><dd>{view.data.map}</dd>
            <dt>Phase</dt><dd>{view.data.phase}</dd>
            <dt>Alive</dt><dd>{view.data.alive} / 4</dd>
            <dt>Kills</dt><dd>{view.data.kills}</dd>
            <dt>WWCD chance</dt><dd>{view.data.wwcdProb}</dd>
            <dt>Status</dt><dd>{view.data.status}</dd>
          </dl>
        </article>
      )}
    </section>
  );
}