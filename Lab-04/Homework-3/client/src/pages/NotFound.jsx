import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section aria-labelledby="nf-title">
      <h1 id="nf-title">404 – Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Back to the tribunal</Link>
    </section>
  );
}