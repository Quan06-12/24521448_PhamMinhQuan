import { useEffect } from 'react';
import { useAppDispatch } from './context/AppProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { EvidenceGrid } from './components/EvidenceGrid';

const SAMPLE_CLIPS = Array.from({ length: 14 }, (_, i) => ({
  _id: `clip-${i + 1}`,
  title: `Handcam POV Match #${i + 1}`,
  tag: i % 2 === 0 ? 'Himass' : 'TanVuu',
  fps: 60,
  verticalRecoilDeg: (13.5 + (i % 4) * 0.4).toFixed(1),
}));

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const controller = new AbortController();
    if (!controller.signal.aborted) {
      dispatch({ type: 'SET_EVIDENCE', payload: SAMPLE_CLIPS });
    }
    return () => controller.abort();
  }, [dispatch]);

  return (
    <main className="app-shell">
      <header className="top-bar">
        <h1>#JusticeForHimassTanVuu Evidence Archive</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['', 'Himass', 'TanVuu'].map((tag) => (
            <button
              key={tag || 'all'}
              type="button"
              className="touch-btn"
              onClick={() => dispatch({ type: 'SET_FILTER', payload: tag })}
            >
              {tag || 'All'}
            </button>
          ))}
          <ThemeToggle />
        </div>
      </header>
      <EvidenceGrid />
    </main>
  );
}