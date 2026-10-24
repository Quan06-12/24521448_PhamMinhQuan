import { prepareTrack } from './prepare-track.js';

const terminal = new Set(['completed', 'failed', 'cancelled']);

/** Bounded preparation is independent of the single, ordered playback lane. */
export class AudioTaskQueue {
  #context;
  #prepare;
  #concurrency;
  #gain;
  #tasks = [];
  #listeners = new Set();
  #sequence = 0;
  #preparing = 0;
  #active = null;
  #running = false;
  #disposed = false;
  #pumping = false;

  constructor({ context, concurrency = 3, prepare = prepareTrack }) {
    if (!Number.isInteger(concurrency) || concurrency < 1) throw new RangeError('Concurrency must be a positive integer.');
    this.#context = context;
    this.#concurrency = concurrency;
    this.#prepare = prepare;
    this.analyser = context.createAnalyser();
    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.82;
    this.#gain = context.createGain();
    this.#gain.gain.value = 0.65;
    this.#gain.connect(this.analyser);
    this.analyser.connect(context.destination);
  }

  enqueue(track) {
    this.#assertLive();
    const sequence = ++this.#sequence;
    const task = {
      id: `task-${sequence}`, sequence, track: Object.freeze({ ...track }),
      status: 'queued', duration: null, error: null,
      controller: new AbortController(), buffer: null, source: null,
    };
    this.#tasks.push(task);
    this.#emit();
    this.#pump();
    return task.id;
  }

  async start() {
    this.#assertLive();
    await this.#context.resume();
    if (this.#disposed) return;
    this.#running = true;
    this.#emit();
    this.#pump();
  }

  cancel(id) {
    const task = this.#tasks.find((item) => item.id === id);
    if (!task || terminal.has(task.status)) return false;
    this.#cancelTask(task);
    this.#emit();
    this.#pump();
    return true;
  }

  cancelAll() {
    for (const task of this.#tasks) {
      if (!terminal.has(task.status)) this.#cancelTask(task);
    }
    this.#emit();
  }

  clearFinished() {
    this.#tasks = this.#tasks.filter((task) => !terminal.has(task.status));
    this.#emit();
  }

  setBins(bins) {
    this.#assertLive();
    if (bins !== 256 && bins !== 512) throw new RangeError('Choose 256 or 512 frequency bins.');
    this.analyser.fftSize = bins * 2;
    this.#emit();
  }

  setVolume(value) {
    this.#assertLive();
    if (!Number.isFinite(value) || value < 0 || value > 1) throw new RangeError('Volume must be between zero and one.');
    this.#gain.gain.setTargetAtTime(value, this.#context.currentTime, 0.02);
  }

  getSnapshot() {
    return Object.freeze({
      tasks: Object.freeze(this.#tasks.map(({ id, sequence, track, status, duration, error }) =>
        Object.freeze({ id, sequence, track, status, duration, error }))),
      activeId: this.#active?.id ?? null,
      running: this.#running, preparing: this.#preparing,
      concurrency: this.#concurrency, bins: this.analyser.frequencyBinCount,
      disposed: this.#disposed,
    });
  }

  subscribe(listener) {
    this.#assertLive();
    this.#listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.#listeners.delete(listener);
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#running = false;
    this.cancelAll();
    this.#gain.disconnect();
    this.analyser.disconnect();
    this.#listeners.clear();
  }

  #assertLive() {
    if (this.#disposed) throw new Error('The audio queue has been disposed.');
  }

  #emit() {
    const snapshot = this.getSnapshot();
    for (const listener of this.#listeners) listener(snapshot);
  }

  #cancelTask(task) {
    task.status = 'cancelled';
    task.controller.abort();
    this.#release(task, true);
  }

  #release(task, stop = false) {
    const source = task.source;
    task.source = null;
    task.buffer = null;
    if (this.#active === task) this.#active = null;
    if (!source) return;
    source.onended = null;
    if (stop) {
      try { source.stop(); } catch { /* A failed start may never have begun. */ }
    }
    source.disconnect();
    source.buffer = null;
  }

  #pump() {
    if (this.#disposed || this.#pumping) return;
    this.#pumping = true;
    try {
      while (!this.#disposed && this.#preparing < this.#concurrency) {
        const task = this.#tasks.find((item) => item.status === 'queued');
        if (!task) break;
        this.#prepareTask(task);
      }
      while (!this.#disposed && this.#running && !this.#active) {
        const head = this.#tasks.find((item) => !terminal.has(item.status));
        if (!head || head.status !== 'ready') break;
        this.#play(head);
      }
    } finally {
      this.#pumping = false;
    }
  }

  async #prepareTask(task) {
    this.#preparing += 1;
    task.status = 'downloading';
    this.#emit();
    try {
      const buffer = await this.#prepare(task.track.url, {
        signal: task.controller.signal,
        context: this.#context,
        onPhase: (phase) => {
          if (terminal.has(task.status) || this.#disposed) return;
          task.status = phase;
          this.#emit();
        },
      });
      if (task.controller.signal.aborted || this.#disposed) return;
      task.buffer = buffer;
      task.duration = buffer.duration;
      task.status = 'ready';
    } catch (error) {
      if (!task.controller.signal.aborted && !this.#disposed) {
        task.status = 'failed';
        task.error = error instanceof Error ? error.message : 'This track could not be prepared.';
        this.#release(task);
      }
    } finally {
      this.#preparing -= 1;
      this.#emit();
      this.#pump();
    }
  }

  #play(task) {
    try {
      const source = this.#context.createBufferSource();
      task.source = source;
      source.buffer = task.buffer;
      task.buffer = null;
      source.connect(this.#gain);
      source.onended = () => {
        if (task.status !== 'playing' || this.#disposed) return;
        task.status = 'completed';
        this.#release(task);
        this.#emit();
        this.#pump();
      };
      task.status = 'playing';
      this.#active = task;
      source.start();
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Playback could not start.';
      this.#release(task, true);
    }
    this.#emit();
  }
}
