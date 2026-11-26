import { Link } from 'react-router';
import { CATEGORIES, PHOTOS } from '../data/photos.js';
import { useGalleryParams } from '../hooks/useGalleryParams.js';

// Temporary Step 3 version: proves the URL drives the state (grid comes in Step 4)
export default function PhotoGalleryLayout() {
  const { category, photoId, buildSearch } = useGalleryParams();

  // Derived during render from the URL
  const visible = category === 'all' ? PHOTOS : PHOTOS.filter((p) => p.category === category);

  return (
    <section aria-labelledby="gallery-title">
      <h1 id="gallery-title">Evidence gallery</h1>
      <p>category = <code>{category}</code>, photo = <code>{photoId ?? 'none'}</code></p>
      <ul>
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Link to={{ search: buildSearch({ category: c.id, photo: null }) }}>{c.label}</Link>
          </li>
        ))}
      </ul>
      <ol>
        {visible.map((p) => (
          <li key={p.id}>
            <Link to={{ search: buildSearch({ photo: p.id }) }}>{p.id} – {p.title}</Link>
          </li>
        ))}
      </ol>
    </section>
  );
}