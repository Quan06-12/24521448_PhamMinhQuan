import { useEffect, useState } from 'react';
import { REPLY_WINDOW_MS } from '../fsm/relationshipMachine.js';

const TICK_MS = 250; // finer than 1 s so the shown second never lags a whole tick
const FULL_SECONDS = Math.ceil(REPLY_WINDOW_MS / 1000);

/**
 * "Seen không rep" timer. Runs only while dating with a message pending; any phase change,
 * reply or unmount runs the cleanup, so no timeout can fire into a finished relationship.
 * @param {string} phase
 * @param {{ id: string, sentAt: number } | null} pendingMessage
 * @param {(action: object) => void} dispatch
 * @returns {number | null} seconds left, or null when nothing is pending
 */
export function useGhostTimer(phase, pendingMessage, dispatch) {
  // Tagged with the message id, so a value left from an older message is never shown
  const [tick, setTick] = useState({ messageId: null, secondsLeft: FULL_SECONDS });

  const messageId = pendingMessage?.id ?? null;
  const sentAt = pendingMessage?.sentAt ?? 0;
  const isWaiting = phase === 'DATING_NO_LOVE' && messageId !== null;

  useEffect(() => {
    if (!isWaiting) return undefined;

    const deadline = sentAt + REPLY_WINDOW_MS;
    // Measured from sentAt, so the StrictMode double-run does not add an extra 5 s
    const timeoutId = window.setTimeout(
      () => dispatch({ type: 'GHOST_TIMEOUT', messageId }),
      Math.max(0, deadline - Date.now()),
    );
    const intervalId = window.setInterval(() => {
      const secondsLeft = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setTick({ messageId, secondsLeft });
    }, TICK_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [isWaiting, messageId, sentAt, dispatch]);

  if (!isWaiting) return null;
  // Before the first tick lands the full window is still left
  return tick.messageId === messageId ? tick.secondsLeft : FULL_SECONDS;
}
