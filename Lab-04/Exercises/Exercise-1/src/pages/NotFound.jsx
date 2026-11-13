import { Link } from 'react-router';

// Catch-all page for any URL that matches no route (path="*")
export default function NotFound() {
  return (
    <section aria-labelledby="notfound-title">
      <h1 id="notfound-title">404 – Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Back to home</Link>
    </section>
  );
}