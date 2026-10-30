import { useEffect } from 'react';
import styles from './DrumPad.module.css';

const FLASH_MS = 150; // how long a pad stays lit after a hit

/**
 * One drum pad button.
 * @param {{ pad: {id: string, key: string, label: string},
 *           hitToken?: number,                 // changes on every hit; undefined = idle
 *           onPress: (padId: string) => void,  // stable (useCallback)
 *           onRelease: (padId: string) => void // stable (useCallback)
 * }} props
 */
export function DrumPad({ pad, hitToken, onPress, onRelease }) {
  // Derived state: lit while a hit token exists (no extra useState)
  const isActive = hitToken !== undefined;

  useEffect(() => {
    if (hitToken === undefined) return undefined;
    // Each new hit changes hitToken -> previous timer is cleared, flash restarts
    const timerId = window.setTimeout(() => onRelease(pad.id), FLASH_MS);
    return () => window.clearTimeout(timerId); // no leak on unmount / re-hit
  }, [hitToken, pad.id, onRelease]);

  return (
    <button
      type="button"
      className={styles.pad}
      aria-pressed={isActive}
      onClick={() => onPress(pad.id)}
    >
      <span>{pad.label}</span>
      <kbd className={styles.key}>{pad.key}</kbd>
    </button>
  );
}