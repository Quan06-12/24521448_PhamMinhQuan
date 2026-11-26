import { useDeckData } from './hooks/useDeckData.js';

// Temporary Step 4 screen: proves the client can read both API endpoints
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
      {status === 'ready' && (
        <>
          <p>{profiles.length} profiles, {swipes.length} saved swipes</p>
          <ul>
            {profiles.map((p) => (
              <li key={p._id}>{p.avatar} {p.name}, {p.age} – {p.city}</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}