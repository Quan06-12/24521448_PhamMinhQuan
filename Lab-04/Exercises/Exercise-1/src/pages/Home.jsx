import { Link } from 'react-router';

// Landing page rendered at "/" inside the shared Layout
export default function Home() {
  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">Responsive Master-Detail Directory</h1>
      <p>
        Lab 04 – Exercise 1: React Router v7 nested layouts, dynamic detail routes
        with <code>useParams</code> and lazy-loaded views.
      </p>
      <p>
        <Link to="/people">Open the people directory →</Link>
      </p>
    </section>
  );
}