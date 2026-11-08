import { usePubgAirdropTimer } from '../hooks/usePubgAirdropTimer.js';
import { getDropPhase } from '../domain/contracts.js';
import { formatCountdown, formatVnd, toIsoDuration } from '../domain/format.js';
import styles from './DropCard.module.css';

const PHASE_LABEL = {
  WARMUP: 'Warm-up',
  AIRDROP_LIVE: 'Airdrop live',
  LOOTED_OUT: 'Looted out',
  EXPIRED: 'Expired',
};

const CLAIM_LABEL = {
  WARMUP: 'Not open yet',
  AIRDROP_LIVE: 'Claim',
  LOOTED_OUT: 'Looted out',
  EXPIRED: 'Claim window closed',
};

/**
 * @param {{ drop: import('../domain/contracts.js').PubgCrateDrop,
 *           isClaiming: boolean,
 *           onClaim: (dropId: string) => void }} props
 */
export function DropCard({ drop, isClaiming, onClaim }) {
  const { remainingMs, elapsedMs } = usePubgAirdropTimer(drop.dropEpochMs);
  // Same tick drives both deadlines, so open/close can never disagree
  const closesInMs = Math.max(0, drop.claimWindowMs - elapsedMs);
  const phase = getDropPhase(remainingMs, drop.remainingStock, closesInMs);
  const isLive = phase === 'AIRDROP_LIVE';
  const countdownMs = phase === 'WARMUP' ? remainingMs : isLive ? closesInMs : 0;
  const countdownLabel = phase === 'WARMUP' ? 'Opens in' : isLive ? 'Closes in' : 'Countdown';

  return (
    <article className={styles.card} data-phase={phase} aria-labelledby={`${drop.id}-title`}>
      <header className={styles.header}>
        <h3 id={`${drop.id}-title`} className={styles.title}>{drop.title}</h3>
        <p className={styles.phase} data-testid="phase">{phase}</p>
      </header>
      <dl className={styles.facts}>
        <div>
          <dt>Price</dt>
          <dd>{formatVnd(drop.priceVnd)}</dd>
        </div>
        <div>
          <dt>{countdownLabel}</dt>
          <dd>
            <time dateTime={toIsoDuration(countdownMs)}>{formatCountdown(countdownMs)}</time>
          </dd>
        </div>
        <div>
          <dt>Stock</dt>
          <dd data-testid="stock">{drop.remainingStock}</dd>
        </div>
      </dl>
      <p className={styles.hint}>{PHASE_LABEL[phase]}</p>
      <button
        type="button"
        className={styles.claim}
        disabled={isClaiming || !isLive}
        aria-busy={isClaiming}
        onClick={() => onClaim(drop.id)}
      >
        {isClaiming ? 'Claiming…' : CLAIM_LABEL[phase]}
      </button>
    </article>
  );
}
