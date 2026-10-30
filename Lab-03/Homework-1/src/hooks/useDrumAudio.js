import { useCallback, useEffect, useRef } from 'react';

/**
 * Preload one <audio> sample per pad and expose a stable playPad(padId).
 * @param {Array<{id: string, src: string}>} pads - must be a stable reference (module constant)
 * @returns {(padId: string) => void}
 */
export function useDrumAudio(pads) {
  // Map padId -> HTMLAudioElement; a ref so playing never causes a re-render
  const samplesRef = useRef(new Map());

  useEffect(() => {
    // Create samples after mount (not during render) and preload them
    const samples = new Map(
      pads.map((pad) => {
        const audio = new Audio(pad.src);
        audio.preload = 'auto';
        return [pad.id, audio];
      }),
    );
    samplesRef.current = samples;

    // Cleanup: stop and release every sample on unmount (StrictMode-safe)
    return () => {
      samples.forEach((audio) => {
        audio.pause();
        audio.removeAttribute('src');
        audio.load(); // abort any pending download
      });
      samples.clear();
    };
  }, [pads]);

  // Stable function (empty deps): reads the latest samples through the ref
  const playPad = useCallback((padId) => {
    const sample = samplesRef.current.get(padId);
    if (!sample) return;
    // Clone = new voice, so fast repeated hits overlap instead of cutting off (polyphony)
    const voice = sample.cloneNode();
    // play() returns a Promise; browsers reject it before the first user gesture
    voice.play().catch((err) => console.warn(`Cannot play "${padId}":`, err.message));
  }, []);

  return playPad;
}