import { useCallback, useState } from 'react';
import { PADS, PAD_BY_CODE } from './pads.js';
import { useDrumKeyboard } from './hooks/useDrumKeyboard.js';
import { useDrumAudio } from './hooks/useDrumAudio.js';
import { DrumPad } from './components/DrumPad.jsx';

// App shell for HW1 – Production Studio Drum Kit
export default function App() {
  const playPad = useDrumAudio(PADS);

  // padId -> hit token (number). Missing key = pad is idle.
  const [hitTokens, setHitTokens] = useState({});

  // Single entry point for every hit (keyboard + click)
  const handleTrigger = useCallback((padId) => {
    playPad(padId);
    // Immutable update: new object, bump this pad's token
    setHitTokens((prev) => ({ ...prev, [padId]: (prev[padId] ?? 0) + 1 }));
  }, [playPad]);

  // Called by DrumPad when its flash timer ends
  const handleRelease = useCallback((padId) => {
    setHitTokens((prev) => {
      const { [padId]: _removed, ...rest } = prev; // copy without this pad
      return rest;
    });
  }, []);

  useDrumKeyboard(PAD_BY_CODE, handleTrigger);

  return (
    <main>
      <h1>Production Studio Drum Kit</h1>

      <section aria-labelledby="pads-heading">
        <h2 id="pads-heading">Pads</h2>
        <ul>
          {PADS.map((pad) => (
            <li key={pad.id}>
              <DrumPad
                pad={pad}
                hitToken={hitTokens[pad.id]}
                onPress={handleTrigger}
                onRelease={handleRelease}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}