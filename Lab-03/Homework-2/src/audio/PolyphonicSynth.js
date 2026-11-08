export const MAX_VOICES = 8;

const VOICE_LEVEL = 0.15;     // 8 voices * 0.15 = 1.2 worst case, still safe with the soft attack
const SILENCE = 0.0001;       // exponential ramps cannot reach exactly 0
const ATTACK_S = 0.01;
const RELEASE_S = 0.04;       // ramp length, avoids the click of a hard stop
const STOP_AFTER_S = 0.05;    // oscillator stops a bit after the ramp ends

/**
 * Plain class (not a component) that owns the AudioContext and the active voices.
 * `voices` is a Map<midi, { osc, gain }>: a Map keeps insertion order, so the first
 * key is always the oldest note and stealing is a FIFO shift.
 */
export class PolyphonicSynth {
  #ctx = null;
  #listeners = new Set();
  voices = new Map();

  // Context is created lazily so it happens inside a user gesture
  #getContext() {
    if (!this.#ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      this.#ctx = new Ctor();
    }
    if (this.#ctx.state === 'suspended') {
      this.#ctx.resume().catch(() => {}); // autoplay policy can still refuse, notes just stay silent
    }
    return this.#ctx;
  }

  #emit(stolenMidi = null) {
    const snapshot = { count: this.voices.size, stolenMidi };
    this.#listeners.forEach((listener) => listener(snapshot));
  }

  /** Listener gets { count, stolenMidi } on every change. Returns the unsubscribe function. */
  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  noteOn(midi, freqHz) {
    if (this.voices.has(midi)) return; // already sounding (key repeat, double trigger)
    const ctx = this.#getContext();
    if (!ctx) return;

    let stolenMidi = null;
    if (this.voices.size >= MAX_VOICES) {
      // Oldest voice = first key in insertion order
      stolenMidi = this.voices.keys().next().value;
      this.#release(stolenMidi);
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freqHz;

    // Soft attack from near-silence so the start does not click either
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(SILENCE, now);
    gain.gain.exponentialRampToValueAtTime(VOICE_LEVEL, now + ATTACK_S);

    osc.connect(gain);
    gain.connect(ctx.destination);
    // Free the nodes once the oscillator is really done
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
    osc.start(now);

    this.voices.set(midi, { osc, gain });
    this.#emit(stolenMidi);
  }

  noteOff(midi) {
    if (this.#release(midi)) this.#emit();
  }

  /** Silence everything (used by Stop Sequence). */
  stopAll() {
    if (this.voices.size === 0) return;
    [...this.voices.keys()].forEach((midi) => this.#release(midi));
    this.#emit();
  }

  /** Stop all voices right away and close the context. Safe to call twice. */
  dispose() {
    this.voices.forEach(({ osc }) => {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    });
    this.voices.clear();
    if (this.#ctx) {
      this.#ctx.close().catch(() => {});
      this.#ctx = null; // a later noteOn builds a fresh context (StrictMode remount)
    }
    this.#emit();
  }

  // Fade the voice out, then stop it. Returns false if the note was not sounding.
  #release(midi) {
    const voice = this.voices.get(midi);
    if (!voice || !this.#ctx) return false;
    const { osc, gain } = voice;
    const t = this.#ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t); // start the ramp from the current level
    gain.gain.exponentialRampToValueAtTime(SILENCE, t + RELEASE_S);
    osc.stop(t + STOP_AFTER_S);
    this.voices.delete(midi);
    return true;
  }
}
