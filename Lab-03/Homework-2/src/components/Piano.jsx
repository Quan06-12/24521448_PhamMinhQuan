import { useEffect, useRef } from 'react';
import { KEYS, MIDDLE_C, WHITE_KEY_COUNT, SHORTCUT_LABEL_BY_MIDI } from '../music/keyboard.js';
import { PianoKey } from './PianoKey.jsx';
import styles from './Piano.module.css';

/**
 * The full 88-key strip inside a horizontally scrollable region,
 * so the page itself never scrolls sideways on phones.
 * @param {{ pressed: Set<number>, onNoteOn: (midi: number) => void, onNoteOff: (midi: number) => void }} props
 */
export function Piano({ pressed, onNoteOn, onNoteOff }) {
  const regionRef = useRef(null);

  // Bring middle C into view once on mount (DOM only, no state)
  useEffect(() => {
    const region = regionRef.current;
    const middleC = region.querySelector(`[data-midi="${MIDDLE_C}"]`);
    if (!middleC) return;
    region.scrollLeft = middleC.offsetLeft - (region.clientWidth - middleC.offsetWidth) / 2;
  }, []);

  return (
    <div
      ref={regionRef}
      className={styles.region}
      role="region"
      aria-label="Piano keyboard, 88 keys from A0 to C8"
      tabIndex={0}
    >
      <div
        className={styles.strip}
        role="group"
        aria-label="Piano keys"
        style={{ '--white-count': WHITE_KEY_COUNT }}
      >
        {KEYS.map((key) => (
          <PianoKey
            key={key.midi}
            midi={key.midi}
            noteName={key.noteName}
            isBlack={key.isBlack}
            whiteIndex={key.whiteIndex}
            shortcut={SHORTCUT_LABEL_BY_MIDI.get(key.midi)}
            isPressed={pressed.has(key.midi)}
            onNoteOn={onNoteOn}
            onNoteOff={onNoteOff}
          />
        ))}
      </div>
    </div>
  );
}
