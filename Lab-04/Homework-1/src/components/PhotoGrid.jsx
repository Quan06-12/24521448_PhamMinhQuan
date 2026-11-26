import { Link } from 'react-router';
import { thumbSrc } from '../data/photos.js';
import styles from './Gallery.module.css';

// First row loads eagerly (largest contentful paint candidate); the rest are lazy
const EAGER_COUNT = 3;

export default function PhotoGrid({ photos, buildSearch }) {
  if (photos.length === 0) {
    return <p>No photos in this category.</p>;
  }

  return (
    <ul className={styles.grid}>
      {photos.map((photo, i) => (
        <li key={photo.id}>
          {/* Opening a photo is a navigation: ?photo=<id> is added to the URL.
              data-photo-id lets the lightbox return focus here later (Step 6). */}
          <Link
            to={{ search: buildSearch({ photo: photo.id }) }}
            className={styles.card}
            data-photo-id={photo.id}
            preventScrollReset
          >
            <figure className={styles.figure}>
              <img
                src={thumbSrc(photo)}
                // Intrinsic 16:9 size reserves space before the file loads (no layout shift)
                width="480"
                height="270"
                alt={photo.title}
                loading={i < EAGER_COUNT ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : undefined}
                decoding="async"
              />
              <figcaption>{photo.title}</figcaption>
            </figure>
          </Link>
        </li>
      ))}
    </ul>
  );
}