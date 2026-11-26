import { Link, useParams } from 'react-router';
import { useJson } from '../hooks/useJson.js';

// /dossier/:playerId – Step 2 version: loading, 404 and error states (the dossier view comes in Step 3)
export default function DossierPage() {
  const { playerId } = useParams();
  // New playerId -> new path -> the hook aborts the old request and fetches the new dossier
  const { loading, data, error, retry } = useJson(`/dossiers/${playerId}`);

  if (loading) return <p aria-busy="true">Loading dossier…</p>;

  if (error?.status === 404) {
    return (
      <section aria-labelledby="nf-title">
        <h1 id="nf-title">Dossier not found</h1>
        <p role="alert">There is no dossier for player &quot;{playerId}&quot;.</p>
        <Link to="/">Back to the tribunal</Link>
      </section>
    );
  }

  if (error) {
    return (
      <p role="alert">
        Could not load the dossier: {error.message}{' '}
        <button type="button" onClick={retry}>Retry</button>
      </p>
    );
  }

  const { dossier, appeals } = data;
  return (
    <section aria-labelledby="dossier-title">
      <h1 id="dossier-title">{dossier.handle}</h1>
      <p>{dossier.team} · {dossier.game} · {dossier.region}</p>
      <p>{dossier.incidents.length} incidents, {appeals.length} appeals on file.</p>
    </section>
  );
}