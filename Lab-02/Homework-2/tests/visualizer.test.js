import test from 'node:test';
import assert from 'node:assert/strict';
import { createVisualizer } from '../src/visualizer.js';

// Deliberately injected timing/canvas doubles. These tests do not measure browser fps.
test('visualizer owns one RAF, reuses bins, avoids frame layout reads and tears down', (t) => {
  const names = ['window', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame'];
  const originals = new Map(names.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  t.after(() => { for (const name of names) { const descriptor = originals.get(name); if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; } });
  const callbacks = new Map();
  let nextId = 0;
  const cancelled = [];
  globalThis.requestAnimationFrame = (callback) => { const id = ++nextId; callbacks.set(id, callback); return id; };
  globalThis.cancelAnimationFrame = (id) => { cancelled.push(id); callbacks.delete(id); };
  const window = new EventTarget();
  window.devicePixelRatio = 3;
  globalThis.window = window;
  let observer;
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; this.disconnects = 0; observer = this; }
    observe(target) { this.target = target; }
    disconnect() { this.disconnects += 1; }
  };
  let reads = 0;
  const transforms = [];
  let paints = 0;
  const canvasContext = { clearRect() { paints += 1; }, fillRect() {}, setTransform(...args) { transforms.push(args); } };
  const canvas = { getContext: () => canvasContext, getBoundingClientRect() { reads += 1; return { width: 640, height: 180 }; } };
  const arrays = [];
  const analyser = { frequencyBinCount: 256, getByteFrequencyData(data) { arrays.push(data); data.fill(30); } };
  const visualizer = createVisualizer(canvas, analyser);
  assert.equal(canvas.width, 1280, 'device pixel ratio is capped at two');
  assert.equal(canvas.height, 360);
  assert.deepEqual(transforms[0], [2, 0, 0, 2, 0, 0]);
  assert.equal(observer.target, canvas);
  assert.equal(callbacks.size, 0);
  visualizer.start();
  visualizer.start();
  assert.equal(callbacks.size, 1);
  const advance = () => { const [id, callback] = callbacks.entries().next().value; callbacks.delete(id); callback(16); };
  advance();
  advance();
  assert.equal(callbacks.size, 1);
  assert.equal(reads, 1, 'frame drawing performs no canvas layout reads');
  assert.equal(arrays[0], arrays[1]);
  assert.equal(arrays[1], arrays[2]);
  analyser.frequencyBinCount = 512;
  advance();
  assert.equal(arrays.at(-1).length, 512);
  assert.notEqual(arrays.at(-1), arrays[0]);
  const changed = arrays.at(-1);
  advance();
  assert.equal(arrays.at(-1), changed);
  const stale = callbacks.values().next().value;
  visualizer.stop();
  assert.equal(callbacks.size, 0);
  assert.equal(cancelled.length, 1);
  const atStop = paints;
  stale(32);
  assert.equal(callbacks.size, 0);
  assert.equal(paints, atStop);
  visualizer.start();
  assert.equal(callbacks.size, 1);
  window.dispatchEvent(new Event('resize'));
  assert.equal(reads, 2);
  visualizer.dispose();
  visualizer.dispose();
  assert.equal(observer.disconnects, 1);
  assert.equal(callbacks.size, 0);
  window.dispatchEvent(new Event('resize'));
  assert.equal(reads, 2, 'dispose removes window resize listener');
  visualizer.start();
  assert.equal(callbacks.size, 0);
});
