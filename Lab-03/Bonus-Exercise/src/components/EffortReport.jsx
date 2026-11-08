import { useId } from 'react';
import { formatScore } from '../fsm/effort.js';

/**
 * Shows derived scores only; it owns no state.
 * @param {{ effort: ReturnType<import('../fsm/effort.js').deriveEffort> }} props
 */
export function EffortReport({ effort }) {
  const { emScore, aiDoScore, ratio, meterValue, isRedFlag } = effort;
  const percent = Math.round(meterValue * 100);
  const meterId = useId();

  return (
    <section aria-labelledby="effort-heading">
      <h2 id="effort-heading">Cán cân nỗ lực</h2>
      {/* Always mounted, so the live region exists before the text changes */}
      <output role="status" aria-live="polite" data-red-flag={isRedFlag}>
        {isRedFlag
          ? `[RED-FLAG] Em cố trăm lần, Ai đó một phần: ${formatScore(emScore)} vs ${formatScore(aiDoScore)}`
          : '[OK] Stable'}
      </output>
      <dl>
        <dt>Điểm Em</dt>
        <dd data-score="em">{formatScore(emScore)}</dd>
        <dt>Điểm Ai Đó</dt>
        <dd data-score="aido">{formatScore(aiDoScore)}</dd>
        <dt>Tỉ lệ Em / Ai Đó</dt>
        <dd data-score="ratio">{ratio === null ? '—' : formatScore(ratio)}</dd>
        <dt>Phần nỗ lực của Em</dt>
        <dd data-score="share">{percent}%</dd>
      </dl>
      <label htmlFor={meterId}>Cán cân (Em)</label>
      <meter id={meterId} min="0" max="1" low="0.5" optimum="1" value={meterValue}>
        {percent}%
      </meter>
    </section>
  );
}
