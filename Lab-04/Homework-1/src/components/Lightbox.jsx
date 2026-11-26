import { useEffect, useRef } from 'react';
import { fullSrc } from '../data/photos.js';
import styles from './Gallery.module.css';

// Native <dialog>: focus trap, Esc to close and ::backdrop come from the browser
export default function Lightbox({ photo, position, total, onClose, onPrev, onNext }) {
  const dialogRef = useRef(null);
  const isOpen = photo !== null;

  // Sync the URL-derived "open" flag to the imperative dialog API (an external system)
  useEffect(() => {
    const dialog = dialogRef.current;
    // Guards: StrictMode runs effects twice, and showModal() on an open dialog is invalid
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Every way of closing (Esc, close button, backdrop, Back button) fires "close".
  // If the URL already dropped ?photo (Back button), isOpen is false: do nothing.
  const handleClose = () => {
    if (!isOpen) return;
    const lastId = photo.id;
    onClose();
    // The browser returns focus to the card that OPENED the dialog (or <body> after a
    // deep link). Move it to the card of the photo the user was actually viewing.
    requestAnimationFrame(() => {
      document.querySelector(`[data-photo-id="${lastId}"]`)?.focus();
    });
  };

  // Arrow keys step through photos while the dialog has focus
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' && onPrev) onPrev();
    if (e.key === 'ArrowRight' && onNext) onNext();
  };

  // A click on the backdrop targets the <dialog> element itself (the panel fills its inside)
  const handleClick = (e) => {
    if (e.target === e.currentTarget) dialogRef.current.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="lightbox-title"
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
    >
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

          <footer className={styles.panelFooter}>
            {/* Disabled (not hidden) at the ends, so the layout does not jump */}
            <button type="button" onClick={onPrev ?? undefined} disabled={!onPrev} aria-label="Previous photo">
              <span aria-hidden="true">←</span> Prev
            </button>
            {/* Announces the new position after each step */}
            <output aria-live="polite">{position} / {total}</output>
            <button type="button" onClick={onNext ?? undefined} disabled={!onNext} aria-label="Next photo">
              Next <span aria-hidden="true">→</span>
            </button>
          </footer>
        </article>
      )}
    </dialog>
  );
}