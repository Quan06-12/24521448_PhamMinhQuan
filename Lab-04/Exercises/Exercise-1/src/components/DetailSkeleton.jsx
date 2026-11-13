import styles from './DetailSkeleton.module.css';

// Placeholder shown while the PersonDetail chunk loads.
// Same box size as the real detail pane, so swapping content causes no layout shift (CLS = 0).
export default function DetailSkeleton() {
  return (
    <section className={styles.skeleton} aria-busy="true" aria-live="polite" aria-label="Loading person details">
      <span className={styles.title} />
      <span className={styles.line} />
      <span className={styles.line} />
      <span className={styles.lineShort} />
    </section>
  );
}