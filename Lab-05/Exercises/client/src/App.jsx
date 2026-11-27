import { useEffect } from 'react';
import { useAppDispatch, useAppState } from './context/AppProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { EvidenceGrid } from './components/EvidenceGrid';
import { ReelsFeed } from './components/ReelsFeed';

const SAMPLE_CLIPS = Array.from({ length: 14 }, (_, i) => ({
  _id: `clip-${i + 1}`,
  title: `Handcam POV Match #${i + 1}`,
  tag: i % 2 === 0 ? 'Himass' : 'TanVuu',
  fps: 60,
  verticalRecoilDeg: (13.5 + (i % 4) * 0.4).toFixed(1),
}));

export default function App() {
  const { activeTab } = useAppState();
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
        <h1>#JusticeForHimassTanVuu</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            className="touch-btn"
            aria-pressed={activeTab === 'archive'}
            onClick={() => dispatch({ type: 'SET_TAB', payload: 'archive' })}
          >
            Archive (Ex 0.2)
          </button>
          <button
            type="button"
            className="touch-btn"
            aria-pressed={activeTab === 'reels'}
            onClick={() => dispatch({ type: 'SET_TAB', payload: 'reels' })}
          >
            Reels (Ex 1.1)
          </button>

          {activeTab === 'archive' &&
            ['', 'Himass', 'TanVuu'].map((tag) => (
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

      {activeTab === 'reels' ? <ReelsFeed /> : <EvidenceGrid />}
    </main>
  );
}