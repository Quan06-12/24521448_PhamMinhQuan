/** Contract first: these declarations describe the JavaScript module boundaries. */
export type TaskStatus = 'queued' | 'downloading' | 'decoding' | 'ready' | 'playing' | 'completed' | 'cancelled' | 'failed';

export interface Track {
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly url: string;
  readonly duration: number;
  readonly mood: string;
}

/** Snapshots contain serializable UI data only, never live audio objects. */
export interface TaskSnapshot {
  readonly id: string;
  readonly sequence: number;
  readonly track: Track;
  readonly status: TaskStatus;
  readonly duration: number | null;
  readonly error: string | null;
}

export interface QueueSnapshot {
  readonly tasks: readonly TaskSnapshot[];
  readonly activeId: string | null;
  readonly running: boolean;
  readonly preparing: number;
  readonly concurrency: number;
  readonly bins: 256 | 512;
  readonly disposed: boolean;
}

export interface PrepareOptions {
  readonly signal: AbortSignal;
  readonly context: AudioContext;
  readonly fetchImpl?: typeof fetch;
  readonly onPhase: (phase: 'downloading' | 'decoding') => void;
}

export declare function prepareTrack(url: string, options: PrepareOptions): Promise<AudioBuffer>;

export interface QueueOptions {
  readonly context: AudioContext;
  readonly concurrency?: number;
  readonly prepare?: typeof prepareTrack;
}

export declare class AudioTaskQueue {
  constructor(options: QueueOptions);
  readonly analyser: AnalyserNode;
  enqueue(track: Track): string;
  start(): Promise<void>;
  cancel(id: string): boolean;
  cancelAll(): void;
  clearFinished(): void;
  setBins(bins: 256 | 512): void;
  setVolume(value: number): void;
  getSnapshot(): QueueSnapshot;
  subscribe(listener: (snapshot: QueueSnapshot) => void): () => void;
  /** Idempotently abort tasks, stop/disconnect sources and disconnect graph. */
  dispose(): void;
}

export interface Visualizer {
  start(): void;
  stop(): void;
  dispose(): void;
}
export declare function createVisualizer(canvas: HTMLCanvasElement, analyser: AnalyserNode): Visualizer;
