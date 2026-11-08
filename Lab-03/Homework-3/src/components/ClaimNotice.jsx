import styles from './ClaimNotice.module.css';

/**
 * Always rendered, so screen readers register the live region before the text changes.
 * @param {{ notice: { id: number, kind: 'success' | 'conflict', title: string } | null }} props
 */
export function ClaimNotice({ notice }) {
  return (
    <div className={styles.notice} role="status" aria-live="polite" data-kind={notice?.kind ?? 'none'}>
      {notice?.kind === 'conflict' && (
        <p key={notice.id}>
          <strong>Looted out — stock restored</strong> <span>({notice.title})</span>
        </p>
      )}
      {notice?.kind === 'success' && (
        <p key={notice.id}>
          <strong>Claimed</strong> <span>({notice.title})</span>
        </p>
      )}
    </div>
  );
}
