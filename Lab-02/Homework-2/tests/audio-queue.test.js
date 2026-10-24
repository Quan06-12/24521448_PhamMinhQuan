import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioTaskQueue } from '../src/audio-queue.js';
import { deferred, flush, fakeContext, track } from './helpers.js';

function controlled(concurrency = 2) {
  const calls = [];
  const context = fakeContext();
  const queue = new AudioTaskQueue({ context, concurrency, prepare: (url, options) => {
    const pending = deferred();
    calls.push({ url, ...options, ...pending });
    return pending.promise;
  } });
  return { queue, context, calls };
}
const buffer = (duration = 1) => ({ duration });

test('bounded preparation can resolve out of order while playback stays FIFO', async () => {
  const { queue, context, calls } = controlled(2);
  const ids = ['a', 'b', 'c'].map((id) => queue.enqueue(track(id)));
  await queue.start();
  assert.equal(calls.length, 2);
  assert.equal(queue.getSnapshot().preparing, 2);
  calls[1].resolve(buffer(2));
  await flush();
  assert.equal(calls.length, 3);
  assert.equal(queue.getSnapshot().preparing, 2);
  assert.equal(context.sources.length, 0, 'ready second track cannot overtake pending head');
  calls[2].resolve(buffer(3));
  calls[0].resolve(buffer(1));
  await flush();
  assert.equal(queue.getSnapshot().activeId, ids[0]);
  assert.equal(context.sources.length, 1);
  context.sources[0].finish();
  assert.equal(queue.getSnapshot().activeId, ids[1]);
  context.sources[1].finish();
  assert.equal(queue.getSnapshot().activeId, ids[2]);
  context.sources[2].finish();
  assert.equal(queue.getSnapshot().activeId, null);
  assert.deepEqual(queue.getSnapshot().tasks.map(({ status }) => status), ['completed', 'completed', 'completed']);
  for (const source of context.sources) {
    assert.equal(source.starts, 1);
    assert.equal(source.stops, 0, 'natural completion does not issue stop');
    assert.equal(source.disconnects, 1);
    assert.equal(source.buffer, null);
    assert.equal(source.onended, null);
  }
  queue.dispose();
});

test('cancelling a decode holds its preparation slot and suppresses late callbacks/results', async () => {
  const { queue, context, calls } = controlled(1);
  const first = queue.enqueue(track('a'));
  const waiting = queue.enqueue(track('never-prepared'));
  const third = queue.enqueue(track('c'));
  await queue.start();
  calls[0].onPhase('decoding');
  assert.equal(queue.cancel(first), true);
  assert.equal(calls[0].signal.aborted, true);
  assert.equal(queue.cancel(waiting), true);
  queue.clearFinished();
  assert.equal(calls.length, 1, 'non-abortable decode still owns the only slot');
  calls[0].onPhase('decoding');
  calls[0].resolve(buffer());
  await flush();
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, '/c.wav');
  assert.equal(context.sources.length, 0);
  calls[1].resolve(buffer());
  await flush();
  assert.equal(queue.getSnapshot().activeId, third);
  queue.dispose();
});

test('cancel ready and playing tasks releases sources and late ended handlers cannot advance twice', async () => {
  const { queue, context, calls } = controlled(3);
  const ids = ['a', 'b', 'c'].map((id) => queue.enqueue(track(id)));
  calls.forEach((call) => call.resolve(buffer()));
  await flush();
  assert.equal(queue.cancel(ids[1]), true, 'ready task can be cancelled before playback starts');
  await queue.start();
  const first = context.sources[0];
  const lateEnded = first.onended;
  assert.equal(queue.cancel(ids[0]), true);
  assert.equal(first.stops, 1);
  assert.equal(first.disconnects, 1);
  assert.equal(first.buffer, null);
  assert.equal(first.onended, null);
  assert.equal(queue.getSnapshot().activeId, ids[2]);
  lateEnded();
  assert.equal(context.sources.length, 2);
  assert.equal(queue.getSnapshot().activeId, ids[2]);
  assert.equal(queue.cancel(ids[0]), false);
  queue.dispose();
});

test('preparation rejection and source-start failure cannot block successors', async () => {
  const { queue, context, calls } = controlled(3);
  const originalCreate = context.createBufferSource;
  let attempted = false;
  context.createBufferSource = () => {
    const source = originalCreate();
    if (!attempted) { attempted = true; source.start = () => { throw new Error('start failed'); }; }
    return source;
  };
  ['a', 'b', 'c'].forEach((id) => queue.enqueue(track(id)));
  calls[0].reject(new Error('decode failed'));
  calls[1].resolve(buffer());
  calls[2].resolve(buffer());
  await flush();
  await queue.start();
  assert.deepEqual(queue.getSnapshot().tasks.map(({ status }) => status), ['failed', 'failed', 'playing']);
  assert.match(queue.getSnapshot().tasks[0].error, /decode failed/);
  assert.match(queue.getSnapshot().tasks[1].error, /start failed/);
  assert.equal(context.sources[0].buffer, null);
  assert.equal(context.sources[0].onended, null);
  assert.equal(context.sources[0].stops, 1);
  assert.equal(context.sources[0].disconnects, 1);
  queue.dispose();
});

test('dispose is idempotent across active playback, pending preparation and resume race', async () => {
  const { queue, context, calls } = controlled(2);
  ['a', 'b'].forEach((id) => queue.enqueue(track(id)));
  calls[0].resolve(buffer());
  await flush();
  await queue.start();
  const source = context.sources[0];
  const lateEnded = source.onended;
  let emissions = 0;
  queue.subscribe(() => emissions += 1);
  queue.dispose();
  const afterDispose = emissions;
  queue.dispose();
  calls[1].onPhase('decoding');
  calls[1].resolve(buffer());
  lateEnded();
  await flush();
  assert.equal(emissions, afterDispose);
  assert.equal(calls[1].signal.aborted, true);
  assert.equal(context.sources.length, 1);
  assert.equal(source.stops, 1);
  assert.equal(source.disconnects, 1);
  assert.equal(source.buffer, null);
  assert.ok(context.nodes.every((node) => node.disconnects === 1));
  assert.equal(queue.getSnapshot().disposed, true);
  assert.equal(queue.getSnapshot().running, false);
  assert.equal(queue.getSnapshot().preparing, 0);
  assert.throws(() => queue.enqueue(track('late')), /disposed/);

  const other = controlled();
  const resumed = deferred();
  other.context.resume = () => resumed.promise;
  const start = other.queue.start();
  other.queue.dispose();
  resumed.resolve();
  await start;
  assert.equal(other.queue.getSnapshot().running, false);
});

test('snapshots are immutable metadata, repeats have unique IDs and bins match FFT size', async () => {
  const { queue, calls } = controlled();
  const item = track('repeat');
  const first = queue.enqueue(item);
  const second = queue.enqueue(item);
  item.title = 'changed outside';
  assert.notEqual(first, second);
  const snapshot = queue.getSnapshot();
  assert.ok(Object.isFrozen(snapshot) && Object.isFrozen(snapshot.tasks) && Object.isFrozen(snapshot.tasks[0].track));
  assert.equal(snapshot.tasks[0].track.title, 'Track repeat');
  assert.deepEqual(Object.keys(snapshot.tasks[0]).sort(), ['duration', 'error', 'id', 'sequence', 'status', 'track']);
  queue.setBins(512);
  assert.equal(queue.analyser.fftSize, 1024);
  assert.equal(queue.getSnapshot().bins, 512);
  queue.setBins(256);
  assert.equal(queue.analyser.fftSize, 512);
  assert.throws(() => queue.setBins(128), RangeError);
  assert.throws(() => queue.setVolume(NaN), RangeError);
  queue.cancelAll();
  calls.forEach((call) => call.resolve(buffer()));
  await flush();
  queue.clearFinished();
  assert.deepEqual(queue.getSnapshot().tasks, []);
  queue.dispose();
});

test('repeated enqueue/cancel cycles leave every created source disconnected without buffers', async () => {
  const context = fakeContext();
  const queue = new AudioTaskQueue({ context, prepare: async () => buffer() });
  await queue.start();
  for (let cycle = 0; cycle < 25; cycle += 1) {
    queue.enqueue(track(`cycle-${cycle}`));
    await flush();
    assert.equal(queue.getSnapshot().tasks.at(-1).status, 'playing');
    queue.cancelAll();
    queue.clearFinished();
    assert.equal(queue.getSnapshot().activeId, null);
    assert.equal(queue.getSnapshot().preparing, 0);
    assert.equal(queue.getSnapshot().tasks.length, 0);
  }
  assert.equal(context.sources.length, 25);
  assert.ok(context.sources.every((source) => source.starts === 1 && source.stops === 1 && source.disconnects === 1 && source.buffer === null && source.onended === null));
  queue.dispose();
});
