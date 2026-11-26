import { Link, useOutletContext } from 'react-router';

// Landing page: reads the dossier list that Layout already fetched (no second request)
export default function Home() {
  const { loading, data, error, retry } = useOutletContext();

  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">Esports Fair-Play Appeal Tribunal</h1>
      <p>Open a player dossier to review sanctions, check their proportionality and file an appeal.</p>
      {loading && <p aria-busy="true">Loading dossiers…</p>}
      {error && (
        <p role="alert">
          Could not load dossiers: {error.message}{' '}
          <button type="button" onClick={retry}>Retry</button>
        </p>
      )}
      {data && (
        <ul>
          {data.map((d) => (
            <li key={d.playerId}>
              <Link to={`/dossier/${d.playerId}`}>{d.handle}</Link> – {d.team}, {d.game} ({d.region})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}