import styles from './ClaimNotice.module.css';

/**
 * Both regions are always rendered, so screen readers register them before the text changes.
 * Failures go to the alert region so they interrupt; good news stays polite.
 * @param {{ notice: { id: number, kind: 'success' | 'conflict' | 'error', title: string } | null }} props
 */
export function ClaimNotice({ notice }) {
  const kind = notice?.kind ?? 'none';
  return (
    <div className={styles.notice} data-kind={kind}>
      <div role="status" aria-live="polite">
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
      <div role="alert">
        {notice?.kind === 'error' && (
          <p key={notice.id}>
            <strong>Claim failed — stock restored, try again</strong> <span>({notice.title})</span>
          </p>
        )}
      </div>
    </div>
  );
}
