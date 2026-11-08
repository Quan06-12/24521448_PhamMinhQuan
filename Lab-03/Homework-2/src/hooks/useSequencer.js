import { useCallback, useEffect, useRef, useState } from 'react';
import { KEY_BY_MIDI } from '../music/keyboard.js';
import { Recorder, addNotes, isAbortError, playSequence } from '../audio/sequencer.js';

/**
 * Recorder + replay state for the piano.
 * @param {{ synth: import('../audio/PolyphonicSynth.js').PolyphonicSynth,
 *           startNote: (midi: number) => void,   // sound + highlight, stable
 *           endNote: (midi: number) => void,     // stable
 *           clearHighlights: () => void }} deps  // stable
 */
export function useSequencer({ synth, startNote, endNote, clearHighlights }) {
  const [recorder] = useState(() => new Recorder());
  const [notes, setNotes] = useState([]);              // FIFO: oldest first
  const [phase, setPhase] = useState('idle');          // idle | recording | playing | stopped
  const [speed, setSpeed] = useState(1);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const controllerRef = useRef(null);

  // Leaving the page cancels any replay that is still scheduled
  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  // Called from real key presses only; replay never feeds the recorder
  const recordNoteOn = useCallback(
    (midi) => {
      const key = KEY_BY_MIDI.get(midi);
      if (key) recorder.noteStarted(midi, key.freqHz, performance.now());
    },
    [recorder],
  );

  const recordNoteOff = useCallback(
    (midi) => {
      const note = recorder.noteEnded(midi, performance.now());
      if (note) setNotes((prev) => addNotes(prev, [note]));
    },
    [recorder],
  );

  const toggleRecording = useCallback(() => {
    if (recorder.isRecording) {
      const closed = recorder.stop(performance.now());
      setNotes((prev) => addNotes(prev, closed));
      setPhase('idle');
    } else {
      recorder.start();
      setPhase('recording');
    }
  }, [recorder]);

  const play = useCallback(async () => {
    if (notes.length === 0) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setPhase('playing');
    setPlayingIndex(0);
    try {
      await playSequence({
        notes,
        speed,
        signal: controller.signal,
        onNoteStart: (note, index) => {
          setPlayingIndex(index);
          startNote(note.midi);
        },
        onNoteEnd: (note) => endNote(note.midi),
      });
      setPhase('idle'); // finished on its own
      setPlayingIndex(-1);
    } catch (err) {
      if (!isAbortError(err)) throw err; // a stop is expected, anything else is a bug
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, [notes, speed, startNote, endNote]);

  const stop = useCallback(() => {
    controllerRef.current?.abort(); // cancels every pending wait at once
    controllerRef.current = null;
    synth.stopAll();                 // silence voices that are still sounding
    clearHighlights();
    setPlayingIndex(-1);
    setPhase('stopped');
  }, [synth, clearHighlights]);

  const clear = useCallback(() => {
    recorder.reset();
    setNotes([]);
    setPhase('idle');
  }, [recorder]);

  const noteWord = notes.length === 1 ? 'note' : 'notes';
  let statusText = 'No recording yet';
  if (phase === 'recording') statusText = `Recording, ${notes.length} ${noteWord} so far`;
  else if (phase === 'playing') statusText = `Playing ${playingIndex + 1} / ${notes.length} at ${speed}x`;
  else if (phase === 'stopped') statusText = 'Stopped';
  else if (notes.length > 0) statusText = `Recorded ${notes.length} ${noteWord}`;

  return {
    notes,
    phase,
    speed,
    setSpeed,
    playingIndex,
    statusText,
    recordNoteOn,
    recordNoteOff,
    toggleRecording,
    play,
    stop,
    clear,
  };
}
