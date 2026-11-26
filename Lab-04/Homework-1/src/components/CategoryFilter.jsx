import { Link } from 'react-router';
import { CATEGORIES } from '../data/photos.js';
import styles from './Gallery.module.css';

// Real links (not buttons): every filter has a shareable URL and works with middle-click
export default function CategoryFilter({ current, buildSearch }) {
  return (
    <nav aria-label="Photo categories">
      <ul className={styles.filters}>
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Link
              to={{ search: buildSearch({ category: c.id, photo: null }) }}
              // Screen readers announce the active filter as "current page"
              aria-current={c.id === current ? 'page' : undefined}
              className={c.id === current ? styles.filterActive : styles.filter}
              preventScrollReset
            >
              {c.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}