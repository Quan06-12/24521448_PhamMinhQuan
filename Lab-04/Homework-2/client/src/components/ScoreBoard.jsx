import { computeMetrics, POINTS } from '../utils/score.js';
import styles from './Deck.module.css';

// Read-only view: every number below is derived from the swipe history on each render
export default function ScoreBoard({ history }) {
  const { counts, total, score, likeRate, verdict } = computeMetrics(history);
  const percent = Math.round(likeRate * 100);

  return (
    <section className={styles.board} aria-labelledby="board-title">
      <h2 id="board-title" className={styles.boardTitle}>Scoreboard</h2>

      {/* aria-live: screen readers hear the new score after each swipe or undo */}
      <output className={styles.score} aria-live="polite">
        {score} pts
      </output>

      <dl className={styles.stats}>
        <dt>Like (+{POINTS.right})</dt>
        <dd>{counts.right}</dd>
        <dt>Super (+{POINTS.up})</dt>
        <dd>{counts.up}</dd>
        <dt>Nope ({POINTS.left})</dt>
        <dd>{counts.left}</dd>
        <dt>Swiped</dt>
        <dd>{total}</dd>
      </dl>

      <label className={styles.meterLabel}>
        Like rate {percent}%
        <meter min={0} max={1} low={0.4} high={0.75} optimum={0.5} value={likeRate} />
      </label>

      <p className={styles.verdict}>{verdict}</p>
    </section>
  );
}