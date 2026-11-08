import { useCallback, useEffect, useState } from 'react';
import { KEY_BY_MIDI, SHORTCUT_BY_CODE } from './music/keyboard.js';
import { MAX_VOICES, PolyphonicSynth } from './audio/PolyphonicSynth.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useSequencer } from './hooks/useSequencer.js';
import { Piano } from './components/Piano.jsx';
import { Sequencer } from './components/Sequencer.jsx';
import styles from './App.module.css';

// Always hand back a NEW Set when something changes, the same Set when nothing does
function withNote(set, midi) {
  if (set.has(midi)) return set;
  const next = new Set(set);
  next.add(midi);
  return next;
}

function withoutNote(set, midi) {
  if (!set.has(midi)) return set;
  const next = new Set(set);
  next.delete(midi);
  return next;
}

export default function App() {
  // One synth for the whole app life; the constructor is cheap (AudioContext is lazy)
  const [synth] = useState(() => new PolyphonicSynth());
  const [pressed, setPressed] = useState(() => new Set());
  const [voiceCount, setVoiceCount] = useState(0);

  // Close the audio context on unmount
  useEffect(() => () => synth.dispose(), [synth]);

  // Voice counter + un-highlight a key whose voice was stolen by the 9th note
  useEffect(
    () =>
      synth.subscribe(({ count, stolenMidi }) => {
        setVoiceCount(count);
        if (stolenMidi !== null) setPressed((prev) => withoutNote(prev, stolenMidi));
      }),
    [synth],
  );

  // Sound + highlight only. Replay uses these directly, so it is never recorded.
  // Deps are the synth (never changes) and setState functions, so both stay stable.
  const startNote = useCallback(
    (midi) => {
      const key = KEY_BY_MIDI.get(midi);
      if (!key) return;
      synth.noteOn(midi, key.freqHz);
      setPressed((prev) => withNote(prev, midi));
    },
    [synth],
  );

  const endNote = useCallback(
    (midi) => {
      synth.noteOff(midi);
      setPressed((prev) => withoutNote(prev, midi));
    },
    [synth],
  );

  const clearHighlights = useCallback(() => {
    setPressed((prev) => (prev.size === 0 ? prev : new Set()));
  }, []);

  const sequencer = useSequencer({ synth, startNote, endNote, clearHighlights });
  const { recordNoteOn, recordNoteOff } = sequencer;

  // What the player triggers: play it and let the recorder see it
  const handleNoteOn = useCallback(
    (midi) => {
      recordNoteOn(midi);
      startNote(midi);
    },
    [recordNoteOn, startNote],
  );

  const handleNoteOff = useCallback(
    (midi) => {
      recordNoteOff(midi);
      endNote(midi);
    },
    [recordNoteOff, endNote],
  );

  useKeyboardShortcuts(SHORTCUT_BY_CODE, handleNoteOn, handleNoteOff);

  return (
    <main className={styles.app}>
      <header>
        <h1 className={styles.title}>88-Key Polyphonic Piano</h1>
        <p className={styles.hint}>
          Click or tap the keys, or press Enter / Space on a focused key. Letters A to K (with W E T Y U for
          the black keys) play C4 to C5.
        </p>
      </header>

      <section className={styles.panel} aria-labelledby="keyboard-heading">
        <h2 id="keyboard-heading" className={styles.panelTitle}>Keyboard</h2>
        <output className={styles.status} role="status" aria-live="polite">
          <span>{sequencer.statusText}</span>
          {' | '}
          {/* Voice count changes on every note, so it stays out of the live announcement */}
          <span aria-hidden="true">Voices {voiceCount} / {MAX_VOICES}</span>
        </output>
        <Piano pressed={pressed} onNoteOn={handleNoteOn} onNoteOff={handleNoteOff} />
      </section>

      <div className={styles.panel}>
        <Sequencer sequencer={sequencer} />
      </div>
    </main>
  );
}
