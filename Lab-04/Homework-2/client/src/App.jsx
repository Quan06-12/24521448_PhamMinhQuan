import { useDeckData } from './hooks/useDeckData.js';
import SwipeDeck from './components/SwipeDeck.jsx';

export default function App() {
  const { status, profiles, swipes, error, retry } = useDeckData();

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h1>Hẹn Hò Nhưng Không Yêu</h1>
      {status === 'loading' && <p aria-busy="true">Loading profiles…</p>}
      {status === 'error' && (
        <p role="alert">
          Could not load the deck: {error}{' '}
          <button type="button" onClick={retry}>Retry</button>
        </p>
      )}
      {/* Mounted only when data is ready, so SwipeDeck can seed its state from props once */}
      {status === 'ready' && <SwipeDeck profiles={profiles} initialSwipes={swipes} />}
    </main>
  );
}