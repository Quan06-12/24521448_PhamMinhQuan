import test from 'node:test';
import assert from 'node:assert/strict';
import { createDeadlineTimer, formatRemaining } from '../src/timer.js';

function clock() {
  let time = 1000;
  let sequence = 0;
  const frames = new Map();
  return {
    now: () => time,
    requestFrame: (callback) => { frames.set(++sequence, callback); return sequence; },
    cancelFrame: (id) => frames.delete(id),
    advance(next) {
      time = next;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback());
    },
    pending: () => frames.size,
  };
}

test('a delayed frame uses the deadline and completes exactly once', () => {
  const fake = clock();
  const ticks = [];
  let completions = 0;
  createDeadlineTimer({ ...fake, deadline: 6000, onTick: (left) => ticks.push(left), onComplete: () => completions++ });
  fake.advance(1016);
  fake.advance(4800);
  fake.advance(9000);
  fake.advance(10000);
  assert.deepEqual(ticks, [4984, 1200, 0]);
  assert.equal(completions, 1);
  assert.equal(fake.pending(), 0);
});

test('stop is idempotent, including cancellation from onTick', () => {
  const fake = clock();
  let count = 0;
  const stop = createDeadlineTimer({ ...fake, deadline: 6000, onTick: () => { count++; stop(); } });
  fake.advance(1500);
  stop();
  fake.advance(2000);
  assert.equal(count, 1);
  assert.equal(fake.pending(), 0);
});

test('formats milliseconds without wrapping minutes or showing negative values', () => {
  assert.equal(formatRemaining(60_001), '01:00.001');
  assert.equal(formatRemaining(-99), '00:00.000');
  assert.equal(formatRemaining(3_600_000), '60:00.000');
});
