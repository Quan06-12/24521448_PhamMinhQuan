import styles from '../App.module.css';

// Same min-height as the message panel to avoid layout shift on load
export default function MessageSkeleton() {
  return (
    <p className={styles.skeleton} aria-busy="true" aria-live="polite">
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.barShort} />
      <span className={styles.srOnly}>Loading messages…</span>
    </p>
  );
}
