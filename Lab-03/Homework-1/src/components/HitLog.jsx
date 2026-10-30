import styles from './HitLog.module.css';

const BURST_WINDOW_MS = 2000; // hits counted toward the meter
const METER_MAX = 10;

// Formatter created once (not on every render)
const timeFormat = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3,
});

/**
 * Visual hit history for deaf / hard-of-hearing users + derived burst meter.
 * @param {{ hits: Array<{id: string, label: string, key: string, at: number}>,
 *           onClear: () => void,
 *           className?: string,       // panel style from parent
 *           titleClassName?: string }} props  // hits: newest first
 */
export function HitLog({ hits, onClear, className = '', titleClassName = '' }) {
  // Derived state (pure, computed during render – no useEffect)
  const latest = hits[0];
  const burst = latest
    ? hits.filter((h) => latest.at - h.at <= BURST_WINDOW_MS).length
    : 0;
  const level = Math.min(burst, METER_MAX);

  return (
    <section className={className} aria-labelledby="log-heading">
      <h2 id="log-heading" className={titleClassName}>Hit log</h2>

      {/* Screen readers announce only the newest hit, not the whole list */}
      <output className={styles.status} aria-live="polite">
        {latest ? `${latest.label} (${latest.key})` : 'No hits yet'}
      </output>

      <p className={styles.meterRow}>
        <label htmlFor="burst-meter">Burst level</label>
        <meter
          id="burst-meter"
          className={styles.meter}
          min={0} max={METER_MAX} low={4} high={7} optimum={2}
          value={level}
        >
          {level} / {METER_MAX}
        </meter>
        <span>{level} / {METER_MAX}</span>
      </p>

      <ol className={styles.list}>
        {hits.map((hit) => (
          <li key={hit.id}>
            <time dateTime={new Date(hit.at).toISOString()}>{timeFormat.format(hit.at)}</time>
            {' – '}{hit.label} <kbd>{hit.key}</kbd>
          </li>
        ))}
      </ol>

      <button type="button" className={styles.clear} onClick={onClear} disabled={hits.length === 0}>
        Clear log
      </button>
    </section>
  );
}