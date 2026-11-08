import { memo, useEffect, useRef } from 'react';
import { midiToSpokenName } from '../music/keyboard.js';
import styles from './PianoKey.module.css';

/**
 * One piano key. Wrapped in memo (shallow compare), so it only re-renders when one of
 * these primitive props changes. onNoteOn / onNoteOff must be stable (useCallback).
 * @param {{ midi: number, noteName: string, isBlack: boolean, whiteIndex: number,
 *           shortcut?: string, isPressed: boolean,
 *           onNoteOn: (midi: number) => void, onNoteOff: (midi: number) => void }} props
 */
export const PianoKey = memo(function PianoKey({
  midi,
  noteName,
  isBlack,
  whiteIndex,
  shortcut,
  isPressed,
  onNoteOn,
  onNoteOff,
}) {
  const buttonRef = useRef(null);
  // Which input started the note, so a pointer leaving never cuts a note held from the keyboard
  const pointerHeldRef = useRef(false);
  const keyHeldRef = useRef(false);

  // Dev-only render counter, written to the DOM in an effect (no state, no re-render).
  // It runs after every commit of THIS key only, so memo isolation can be checked in the page.
  // The DEV check is a build-time constant, so production does no DOM write at all.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const el = buttonRef.current;
    el.dataset.renders = String(Number(el.dataset.renders ?? 0) + 1);
  });

  const handlePointerDown = (e) => {
    if (e.button !== 0) return;                 // left button / touch / pen only
    e.currentTarget.setPointerCapture(e.pointerId); // keep the release even if the pointer drifts off
    pointerHeldRef.current = true;
    onNoteOn(midi);
  };

  const releasePointer = () => {
    if (!pointerHeldRef.current) return;
    pointerHeldRef.current = false;
    onNoteOff(midi);
  };

  const handleKeyDown = (e) => {
    if (e.repeat) return;                       // holding the key must not retrigger
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    keyHeldRef.current = true;
    onNoteOn(midi);
  };

  const releaseKey = () => {
    if (!keyHeldRef.current) return;
    keyHeldRef.current = false;
    onNoteOff(midi);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      className={isBlack ? styles.black : styles.white}
      style={{ '--white-index': whiteIndex }}
      data-midi={midi}
      aria-label={isBlack ? midiToSpokenName(midi) : undefined}
      aria-pressed={isPressed}
      onPointerDown={handlePointerDown}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
      onPointerLeave={releasePointer}
      onKeyDown={handleKeyDown}
      onKeyUp={releaseKey}
      onBlur={releaseKey}
    >
      <span className={styles.name} aria-hidden={isBlack}>{noteName}</span>
      {shortcut && <kbd className={styles.shortcut} aria-hidden="true">{shortcut}</kbd>}
    </button>
  );
});
