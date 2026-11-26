import { useSearchParams } from 'react-router';
import { CATEGORIES } from '../data/photos.js';

const VALID = new Set(CATEGORIES.map((c) => c.id));

// The query string is the single source of truth: ?category=<id>&photo=<id>
export function useGalleryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derived on every render: unknown category in the URL falls back to "all"
  const raw = searchParams.get('category');
  const category = raw && VALID.has(raw) ? raw : 'all';
  const photoId = searchParams.get('photo');

  // Build "?..." for <Link to={{ search }}>, keeping the other params.
  // null or 'all' removes the key, so "All" gives a clean /gallery URL.
  const buildSearch = (changes) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === 'all') next.delete(key);
      else next.set(key, value);
    }
    const query = next.toString();
    return query ? `?${query}` : '';
  };

  // Closing pushes a new history entry without "photo"
  const closePhoto = () =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('photo');
      return next;
    }, { preventScrollReset: true });

  // Prev / next REPLACE the entry so stepping through photos does not flood history
  const showPhoto = (id) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('photo', id);
      return next;
    }, { replace: true, preventScrollReset: true });

  return { category, photoId, buildSearch, closePhoto, showPhoto };
}