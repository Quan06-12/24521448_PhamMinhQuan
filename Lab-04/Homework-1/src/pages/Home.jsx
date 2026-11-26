import { Link } from 'react-router';
import { CATEGORIES, PHOTOS } from '../data/photos.js';

// Landing page: each category is a deep link into a filtered gallery
export default function Home() {
  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">TFT Fair-Play Evidence Gallery</h1>
      <p>
        {PHOTOS.length} Teamfight Tactics screenshots submitted with a fair-play appeal. Filter them by
        category and open any photo in a full-screen viewer; every view has its own shareable link.
      </p>
      <ul>
        {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
          <li key={c.id}>
            <Link to={`/gallery?category=${c.id}`}>{c.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}