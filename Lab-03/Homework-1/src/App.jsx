import { useCallback, useState } from 'react';
import { PADS, PAD_BY_CODE, PAD_BY_ID } from './pads.js';
import { useDrumKeyboard } from './hooks/useDrumKeyboard.js';
import { useDrumAudio } from './hooks/useDrumAudio.js';
import { DrumPad } from './components/DrumPad.jsx';
import { HitLog } from './components/HitLog.jsx';
import styles from './App.module.css';

const MAX_LOG = 10; // keep only the 10 most recent hits

// App shell for HW1 – Production Studio Drum Kit
export default function App() {
  const playPad = useDrumAudio(PADS);
  const [hitTokens, setHitTokens] = useState({}); // padId -> flash token
  const [hits, setHits] = useState([]);           // newest first

  const handleTrigger = useCallback((padId) => {
    const pad = PAD_BY_ID.get(padId);
    if (!pad) return;
    playPad(padId);

    // Build the entry OUTSIDE the updater: updaters must stay pure
    // (StrictMode calls them twice; randomUUID/Date.now would differ)
    const entry = { id: crypto.randomUUID(), label: pad.label, key: pad.key, at: Date.now() };

    setHitTokens((prev) => ({ ...prev, [padId]: (prev[padId] ?? 0) + 1 }));
    setHits((prev) => [entry, ...prev].slice(0, MAX_LOG)); // immutable, capped
  }, [playPad]);

  const handleRelease = useCallback((padId) => {
    setHitTokens((prev) => {
      const next = { ...prev };
      delete next[padId]; // safe: deleting on the copy, not on state
      return next;
    });
  }, []);

  const handleClearLog = useCallback(() => setHits([]), []);

  useDrumKeyboard(PAD_BY_CODE, handleTrigger);

    return (
    <main className={styles.app}>
      <h1 className={styles.title}>Production Studio Drum Kit</h1>

      <section className={styles.panel} aria-labelledby="pads-heading">
        <h2 id="pads-heading" className={styles.panelTitle}>Pads</h2>
        {/* role="list": Safari drops list semantics when list-style is none */}
        <ul className={styles.padGrid} role="list">
          {PADS.map((pad) => (
            <li key={pad.id}>
              <DrumPad
                pad={pad}
                hitToken={hitTokens[pad.id]}
                onPress={handleTrigger}
                onRelease={handleRelease}
              />
            </li>
          ))}
        </ul>
      </section>

      <HitLog
        hits={hits}
        onClear={handleClearLog}
        className={styles.panel}
        titleClassName={styles.panelTitle}
      />
    </main>
  );
}