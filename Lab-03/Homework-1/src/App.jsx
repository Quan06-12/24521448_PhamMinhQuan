import { useCallback } from 'react';
import { PAD_BY_CODE } from './pads.js';
import { useDrumKeyboard } from './hooks/useDrumKeyboard.js';

// App shell for HW1 – Production Studio Drum Kit
export default function App() {
  // useCallback keeps the same function reference across renders,
  // otherwise useDrumKeyboard would re-attach the listener on every render
  const handleTrigger = useCallback((padId) => {
    console.log('hit:', padId); // temporary – replaced by audio in Step 8
  }, []);

  useDrumKeyboard(PAD_BY_CODE, handleTrigger);

  return (
    <main>
      <h1>Production Studio Drum Kit</h1>
    </main>
  );
}