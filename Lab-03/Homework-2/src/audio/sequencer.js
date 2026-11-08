// Gap inserted before the first note of a second take, so takes do not glue together
const TAKE_GAP_MS = 500;

function createAbortError() {
  return new DOMException('Sequence stopped', 'AbortError');
}

export function isAbortError(err) {
  return err instanceof DOMException && err.name === 'AbortError';
}

/** setTimeout as a promise that rejects at once when the signal aborts (timer is cleared). */
export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }
    let timerId = 0;
    const handleAbort = () => {
      window.clearTimeout(timerId);
      reject(createAbortError());
    };
    timerId = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, ms);
    signal.addEventListener('abort', handleAbort, { once: true });
  });
}

/**
 * Keeps the bookkeeping of a recording outside React state: which notes are still held,
 * when the previous note started. Only finished notes become state (see useSequencer).
 * Time is always passed in by the event handler that read performance.now().
 */
export class Recorder {
  #isRecording = false;
  #open = new Map(); // midi -> note that has started but not ended yet
  #lastStartMs = null;
  #seq = 0;

  get isRecording() {
    return this.#isRecording;
  }

  start() {
    this.#isRecording = true;
    this.#lastStartMs = null; // first note of a take has no "previous note" in this take
  }

  noteStarted(midi, freqHz, nowMs) {
    if (!this.#isRecording || this.#open.has(midi)) return;
    let deltaMs = 0;
    if (this.#lastStartMs !== null) deltaMs = nowMs - this.#lastStartMs;
    else if (this.#seq > 0) deltaMs = TAKE_GAP_MS;
    this.#open.set(midi, { seq: this.#seq, midi, freqHz, startedMs: nowMs, deltaMs });
    this.#seq += 1;
    this.#lastStartMs = nowMs;
  }

  /** Returns the finished note, or null if this key was not being recorded. */
  noteEnded(midi, nowMs) {
    const open = this.#open.get(midi);
    if (!open) return null;
    this.#open.delete(midi);
    return finishNote(open, nowMs);
  }

  /** Stop recording; notes still held are closed at nowMs. Returns them. */
  stop(nowMs) {
    this.#isRecording = false;
    const closed = [...this.#open.values()].map((open) => finishNote(open, nowMs));
    this.#open.clear();
    return closed;
  }

  reset() {
    this.#isRecording = false;
    this.#open.clear();
    this.#lastStartMs = null;
    this.#seq = 0;
  }
}

function finishNote(open, nowMs) {
  return {
    id: crypto.randomUUID(),
    seq: open.seq, // start order, so overlapping notes replay in the right place
    midi: open.midi,
    freqHz: open.freqHz,
    durationMs: Math.max(1, Math.round(nowMs - open.startedMs)),
    deltaMs: Math.round(open.deltaMs),
  };
}

// Notes arrive in the order they END; replay needs the order they STARTED
export function addNotes(notes, added) {
  if (added.length === 0) return notes;
  return [...notes, ...added].sort((a, b) => a.seq - b.seq);
}

/**
 * Replay a recording. Each note waits for its start (sum of deltas), then holds for its
 * own duration without blocking the next start, so chords overlap like they were played.
 * Waits are divided by `speed`. Rejects with an AbortError as soon as `signal` aborts.
 */
export async function playSequence({ notes, speed, signal, onNoteStart, onNoteEnd }) {
  const holds = [];
  for (let i = 0; i < notes.length; i += 1) {
    const note = notes[i];
    await sleep(note.deltaMs / speed, signal);
    onNoteStart(note, i);
    const hold = sleep(note.durationMs / speed, signal).then(() => onNoteEnd(note));
    hold.catch(() => {}); // an abort rejects every pending hold; Promise.all below reports it once
    holds.push(hold);
  }
  await Promise.all(holds);
}
