import { useEffect } from 'react';

// Ignore shortcuts while the user is typing in a form field
const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Listen to physical keys and trigger the matching drum pad.
 * @param {Map<string, object>} padByCode - KeyboardEvent.code -> pad
 * @param {(padId: string) => void} onTriggerPad - must be stable (useCallback)
 * @param {boolean} isEnabled - turn shortcuts on/off
 */
export function useDrumKeyboard(padByCode, onTriggerPad, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const handleKeyDown = (e) => {
      if (e.repeat) return;                                 // block OS key-hold flood
      if (e.ctrlKey || e.metaKey || e.altKey) return;       // keep browser shortcuts (Ctrl+S, Ctrl+L...)
      const target = e.target;
      if (TYPING_TAGS.has(target.tagName) || target.isContentEditable) return; // focus isolation

      const pad = padByCode.get(e.code);                    // physical key, never keyCode
      if (!pad) return;

      e.preventDefault();
      onTriggerPad(pad.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    // Cleanup: remove listener on unmount or when deps change (no leaks, StrictMode-safe)
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [padByCode, onTriggerPad, isEnabled]);
}