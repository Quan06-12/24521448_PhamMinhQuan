import { useId } from 'react';
import { formatScore } from '../fsm/effort.js';
import styles from './EffortReport.module.css';

/**
 * Shows derived scores only; it owns no state.
 * @param {{ effort: ReturnType<import('../fsm/effort.js').deriveEffort>, className?: string }} props
 */
export function EffortReport({ effort, className }) {
  const { emScore, aiDoScore, ratio, meterValue, isRedFlag } = effort;
  const percent = Math.round(meterValue * 100);
  const meterId = useId();

  return (
    <section className={className} aria-labelledby="effort-heading">
      <h2 id="effort-heading">Cán cân nỗ lực</h2>
      {/* Always mounted, so the live region exists before the text changes */}
      <output className={styles.status} role="status" aria-live="polite" data-red-flag={isRedFlag}>
        {isRedFlag
          ? `[RED-FLAG] Em cố trăm lần, Ai đó một phần: ${formatScore(emScore)} vs ${formatScore(aiDoScore)}`
          : '[OK] Stable'}
      </output>
      <dl className={styles.scores}>
        <dt>Điểm Em</dt>
        <dd data-score="em">{formatScore(emScore)}</dd>
        <dt>Điểm Ai Đó</dt>
        <dd data-score="aido">{formatScore(aiDoScore)}</dd>
        <dt>Tỉ lệ Em / Ai Đó</dt>
        <dd data-score="ratio">{ratio === null ? '—' : formatScore(ratio)}</dd>
        <dt>Phần nỗ lực của Em</dt>
        <dd data-score="share">{percent}%</dd>
      </dl>
      <label className={styles.meterLabel} htmlFor={meterId}>Cán cân (Em)</label>
      <meter className={styles.meter} id={meterId} min="0" max="1" low="0.5" optimum="1" value={meterValue}>
        {percent}%
      </meter>
    </section>
  );
}
