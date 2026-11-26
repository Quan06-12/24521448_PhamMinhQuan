import { CATEGORIES, PHOTOS } from '../data/photos.js';
import { useGalleryParams } from '../hooks/useGalleryParams.js';
import CategoryFilter from '../components/CategoryFilter.jsx';
import PhotoGrid from '../components/PhotoGrid.jsx';

export default function PhotoGalleryLayout() {
  const { category, photoId, buildSearch } = useGalleryParams();

  // Everything below is derived from the URL during render
  const visible = category === 'all' ? PHOTOS : PHOTOS.filter((p) => p.category === category);
  const selected = photoId ? PHOTOS.find((p) => p.id === photoId) ?? null : null;
  const label = CATEGORIES.find((c) => c.id === category).label;

  return (
    <section aria-labelledby="gallery-title">
      <h1 id="gallery-title">Evidence gallery</h1>
      <CategoryFilter current={category} buildSearch={buildSearch} />

      {/* Live region: screen readers hear the new count after each filter change */}
      <p role="status" style={{ color: '#94a3b8' }}>
        {visible.length} photo{visible.length === 1 ? '' : 's'} in {label}
      </p>

      {/* Bad deep link such as ?photo=zzz */}
      {photoId && !selected && (
        <p role="alert" style={{ color: '#fca5a5' }}>
          Photo &quot;{photoId}&quot; does not exist. It may have been removed from the case file.
        </p>
      )}

      <PhotoGrid photos={visible} buildSearch={buildSearch} />
      {/* Step 5: <Lightbox photo={selected} ... /> goes here */}
    </section>
  );
}