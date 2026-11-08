import { useId } from 'react';
import { KEY_BY_MIDI } from '../music/keyboard.js';
import styles from './Sequencer.module.css';

const SPEEDS = [0.5, 1, 2];

/**
 * Controls + list of the recorded notes. All state lives in useSequencer.
 * @param {{ sequencer: ReturnType<typeof import('../hooks/useSequencer.js').useSequencer> }} props
 */
export function Sequencer({ sequencer }) {
  const speedId = useId();
  const { notes, phase, speed, playingIndex } = sequencer;
  const isRecording = phase === 'recording';
  const isPlaying = phase === 'playing';

  return (
    <section className={styles.sequencer} aria-labelledby="sequencer-heading">
      <h2 id="sequencer-heading" className={styles.title}>Sequencer</h2>

      <form className={styles.controls} onSubmit={(e) => e.preventDefault()}>
        <fieldset className={styles.group} disabled={isPlaying}>
          <legend className={styles.legend}>Record</legend>
          <button type="button" className={styles.button} aria-pressed={isRecording} onClick={sequencer.toggleRecording}>
            {isRecording ? 'Stop recording' : 'Record'}
          </button>
          <button
            type="button"
            className={styles.button}
            disabled={notes.length === 0 || isRecording}
            onClick={sequencer.clear}
          >
            Clear recording
          </button>
        </fieldset>

        <fieldset className={styles.group}>
          <legend className={styles.legend}>Playback</legend>
          <div className={styles.field}>
            <label htmlFor={speedId}>Speed</label>
            <select
              id={speedId}
              className={styles.select}
              value={speed}
              disabled={isPlaying}
              onChange={(e) => sequencer.setSpeed(Number(e.target.value))}
            >
              {SPEEDS.map((value) => (
                <option key={value} value={value}>{value}x</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className={styles.button}
            disabled={notes.length === 0 || isRecording || isPlaying}
            onClick={sequencer.play}
          >
            Play
          </button>
          <button type="button" className={styles.button} disabled={!isPlaying} onClick={sequencer.stop}>
            Stop Sequence
          </button>
        </fieldset>
      </form>

      {notes.length > 0 && (
        <ol className={styles.notes} aria-label="Recorded notes">
          {notes.map((note, index) => (
            <li
              key={note.id}
              className={styles.note}
              aria-current={isPlaying && index === playingIndex ? 'step' : undefined}
            >
              <span className={styles.noteName}>{KEY_BY_MIDI.get(note.midi).noteName}</span>
              <span className={styles.noteMeta}>{note.durationMs} ms, +{note.deltaMs} ms</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
