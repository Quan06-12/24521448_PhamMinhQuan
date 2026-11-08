import { useEffect, useState } from 'react';

const TICK_MS = 250; // finer than 1 s so the displayed second never lags by almost a whole tick

/**
 * Zero-drift countdown. The state is the wall clock, not a decremented counter:
 * a throttled background tab (or a sleeping laptop) just reads a newer Date.now()
 * on the next tick, so nothing can accumulate drift.
 * @param {number} targetEpochMs - absolute end time
 * @param {number} [serverOffsetMs] - serverTime - clientTime, to trust the server clock
 * @returns {{ remainingMs: number, isLive: boolean }}
 */
export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) {
  // Lazy initialiser, so the first paint is already correct
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const syncClock = () => setNowMs(Date.now());
    const timerId = window.setInterval(syncClock, TICK_MS);

    // Browsers throttle timers in hidden tabs, so resync the moment the tab is visible again
    const onWake = () => {
      if (document.visibilityState === 'visible') syncClock();
    };
    document.addEventListener('visibilitychange', onWake);

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, []);

  // Derived during render: changing the target or offset needs no effect
  const remainingMs = Math.max(0, targetEpochMs - (nowMs + serverOffsetMs));
  return { remainingMs, isLive: remainingMs === 0 };
}
