const BURST_WINDOW_MS = 2000; // hits counted toward the meter
const METER_MAX = 10;

// Formatter created once (not on every render)
const timeFormat = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3,
});

/**
 * Visual hit history for deaf / hard-of-hearing users + derived burst meter.
 * @param {{ hits: Array<{id: string, label: string, key: string, at: number}>,
 *           onClear: () => void }} props  // hits: newest first
 */
export function HitLog({ hits, onClear }) {
  // Derived state (pure, computed during render – no useEffect):
  // number of hits within 2s of the latest hit, capped at METER_MAX
  const latest = hits[0];
  const burst = latest
    ? hits.filter((h) => latest.at - h.at <= BURST_WINDOW_MS).length
    : 0;
  const level = Math.min(burst, METER_MAX);

  return (
    <section aria-labelledby="log-heading">
      <h2 id="log-heading">Hit log</h2>

      {/* Screen readers announce only the newest hit, not the whole list */}
      <output aria-live="polite">
        {latest ? `${latest.label} (${latest.key})` : 'No hits yet'}
      </output>

      <p>
        <label htmlFor="burst-meter">Burst level</label>{' '}
        <meter id="burst-meter" min={0} max={METER_MAX} low={4} high={7} optimum={2} value={level}>
          {level} / {METER_MAX}
        </meter>{' '}
        <span>{level} / {METER_MAX}</span>
      </p>

      <ol>
        {hits.map((hit) => (
          <li key={hit.id}>
            <time dateTime={new Date(hit.at).toISOString()}>{timeFormat.format(hit.at)}</time>
            {' – '}{hit.label} <kbd>{hit.key}</kbd>
          </li>
        ))}
      </ol>

      <button type="button" onClick={onClear} disabled={hits.length === 0}>
        Clear log
      </button>
    </section>
  );
}