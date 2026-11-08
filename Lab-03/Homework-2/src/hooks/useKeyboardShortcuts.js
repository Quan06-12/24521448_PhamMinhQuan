import { useEffect } from 'react';

// Do not steal letters while the user is typing or using a form control
const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Play notes from the computer keyboard (physical key position, so any layout works).
 * @param {Map<string, number>} midiByCode - KeyboardEvent.code -> MIDI number (module constant)
 * @param {(midi: number) => void} onNoteOn - stable (useCallback)
 * @param {(midi: number) => void} onNoteOff - stable (useCallback)
 */
export function useKeyboardShortcuts(midiByCode, onNoteOn, onNoteOff) {
  useEffect(() => {
    const held = new Set(); // codes pressed by us, so keyup always matches a keydown

    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const target = e.target;
      if (TYPING_TAGS.has(target.tagName) || target.isContentEditable) return;
      const midi = midiByCode.get(e.code);
      if (midi === undefined || held.has(e.code)) return;
      held.add(e.code);
      onNoteOn(midi);
    };

    const handleKeyUp = (e) => {
      if (!held.delete(e.code)) return;
      onNoteOff(midiByCode.get(e.code));
    };

    // Window loses focus while a key is down -> keyup never arrives, so release everything
    const handleBlur = () => {
      held.forEach((code) => onNoteOff(midiByCode.get(code)));
      held.clear();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [midiByCode, onNoteOn, onNoteOff]);
}
