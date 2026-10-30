import { useCallback } from 'react';
import { PADS, PAD_BY_CODE } from './pads.js';
import { useDrumKeyboard } from './hooks/useDrumKeyboard.js';
import { useDrumAudio } from './hooks/useDrumAudio.js';

// App shell for HW1 – Production Studio Drum Kit
export default function App() {
  const playPad = useDrumAudio(PADS);

  // Single entry point for every hit (keyboard now, pad buttons in Step 9)
  const handleTrigger = useCallback((padId) => {
    playPad(padId);
  }, [playPad]);

  useDrumKeyboard(PAD_BY_CODE, handleTrigger);

  return (
    <main>
      <h1>Production Studio Drum Kit</h1>
    </main>
  );
}