import { useEffect, useRef } from 'react';
import { fullSrc } from '../data/photos.js';
import styles from './Gallery.module.css';

// Native <dialog>: focus trap, Esc to close and ::backdrop come from the browser
export default function Lightbox({ photo, onClose }) {
  const dialogRef = useRef(null);
  const isOpen = photo !== null;

  // Sync the URL-derived "open" flag to the imperative dialog API (an external system)
  useEffect(() => {
    const dialog = dialogRef.current;
    // Guards: StrictMode runs effects twice, and showModal() on an open dialog is invalid
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Every way of closing (Esc, close button, Back button) fires the "close" event.
  // If the URL already dropped ?photo (Back button), isOpen is false: do nothing,
  // otherwise we would push a duplicate history entry.
  const handleClose = () => {
    if (isOpen) onClose();
  };

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="lightbox-title" onClose={handleClose}>
      {photo && (
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 id="lightbox-title">{photo.title}</h2>
            {/* Close through the dialog API so it goes through the same "close" event */}
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Close viewer"
              onClick={() => dialogRef.current.close()}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </header>

          <figure className={styles.viewer}>
            <img src={fullSrc(photo)} alt={`${photo.title}. ${photo.description}`} />
            <figcaption>{photo.description}</figcaption>
          </figure>

          <dl className={styles.meta}>
            <dt>Evidence ID</dt>
            <dd>{photo.id.toUpperCase()}</dd>
            <dt>Category</dt>
            <dd>{photo.category}</dd>
            <dt>Source</dt>
            <dd>{photo.source}</dd>
          </dl>
        </article>
      )}
    </dialog>
  );
}