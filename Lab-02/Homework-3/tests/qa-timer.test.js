import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeadlineTimer, formatRemaining } from '../src/timer.js';

function scheduler(initial = 0) {
  let time = initial;
  let id = 0;
  const pending = new Map();
  return {
    now: () => time,
    requestFrame: (callback) => { pending.set(++id, callback); return id; },
    cancelFrame: (key) => pending.delete(key),
    fire(next) {
      time = next;
      const batch = [...pending.values()];
      pending.clear();
      batch.forEach((callback) => callback(next));
    },
    size: () => pending.size,
  };
}

test('QA: exact deadline completes once and never creates a second RAF chain', () => {
  const fake = scheduler();
  const ticks = [];
  let completed = 0;
  const stop = createDeadlineTimer({ ...fake, deadline: 1000, onTick: (value) => ticks.push(value), onComplete: () => completed++ });
  for (const time of [1, 10, 100, 999]) {
    fake.fire(time);
    assert.equal(fake.size(), 1);
  }
  fake.fire(1000);
  assert.deepEqual(ticks, [999, 990, 900, 1, 0]);
  assert.equal(completed, 1);
  assert.equal(fake.size(), 0);
  stop(); stop(); fake.fire(2000);
  assert.equal(completed, 1);
});

test('QA: cancelling before the first frame invokes neither callback', () => {
  const fake = scheduler();
  let callbacks = 0;
  const stop = createDeadlineTimer({ ...fake, deadline: 0, onTick: () => callbacks++, onComplete: () => callbacks++ });
  stop(); stop(); fake.fire(10);
  assert.equal(callbacks, 0);
  assert.equal(fake.size(), 0);
});

test('QA: an already elapsed sale reports zero on its first frame', () => {
  const fake = scheduler(5000);
  const ticks = [];
  createDeadlineTimer({ ...fake, deadline: 1000, onTick: (remaining) => ticks.push(remaining) });
  fake.fire(5001);
  assert.deepEqual(ticks, [0]);
  assert.equal(fake.size(), 0);
});

test('QA: sub-millisecond remaining time does not display expiry early', () => {
  assert.equal(formatRemaining(0.001), '00:00.001');
  assert.equal(formatRemaining(999.001), '00:01.000');
});
