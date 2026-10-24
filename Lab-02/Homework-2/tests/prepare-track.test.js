import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareTrack } from '../src/prepare-track.js';
import { deferred, flush } from './helpers.js';

function setup(overrides = {}) {
  const controller = new AbortController();
  const phases = [];
  const bytes = new ArrayBuffer(4);
  const buffer = { duration: 1 };
  const calls = [];
  return {
    controller, phases, bytes, buffer, calls,
    options: {
      signal: controller.signal,
      onPhase: (phase) => phases.push(phase),
      fetchImpl: async (url, options) => { calls.push([url, options]); return { ok: true, arrayBuffer: async () => bytes }; },
      context: { decodeAudioData: async (input) => { assert.equal(input, bytes); return buffer; } },
      ...overrides,
    },
  };
}

test('prepare forwards abort signal and emits ordered fetch/decode phases', async () => {
  const fixture = setup();
  assert.equal(await prepareTrack('/song.wav', fixture.options), fixture.buffer);
  assert.deepEqual(fixture.phases, ['downloading', 'decoding']);
  assert.equal(fixture.calls[0][0], '/song.wav');
  assert.equal(fixture.calls[0][1].signal, fixture.controller.signal);
});

test('already cancelled work does not fetch or report phases', async () => {
  const fixture = setup();
  fixture.controller.abort();
  await assert.rejects(prepareTrack('/song.wav', fixture.options), { name: 'AbortError' });
  assert.equal(fixture.calls.length, 0);
  assert.deepEqual(fixture.phases, []);
});

for (const stage of ['fetch', 'body', 'decode']) {
  test(`cancellation during ${stage} discards late success`, async () => {
    const pending = deferred();
    let decoded = 0;
    const fixture = setup();
    fixture.options.fetchImpl = async () => stage === 'fetch' ? pending.promise : { ok: true, arrayBuffer: () => stage === 'body' ? pending.promise : Promise.resolve(fixture.bytes) };
    fixture.options.context.decodeAudioData = () => { decoded += 1; return stage === 'decode' ? pending.promise : Promise.resolve(fixture.buffer); };
    const work = prepareTrack('/song.wav', fixture.options);
    const rejected = assert.rejects(work, { name: 'AbortError' });
    await flush();
    fixture.controller.abort();
    pending.resolve(stage === 'fetch' ? { ok: true, arrayBuffer: async () => fixture.bytes } : stage === 'body' ? fixture.bytes : fixture.buffer);
    await rejected;
    assert.equal(decoded, stage === 'decode' ? 1 : 0);
  });
}

test('HTTP, unreadable bodies and invalid audio reject without claiming readiness', async () => {
  for (const stage of ['http', 'body', 'decode']) {
    const fixture = setup();
    const failure = new Error(`${stage} failure`);
    fixture.options.fetchImpl = async () => ({ ok: stage !== 'http', status: 503, arrayBuffer: async () => { if (stage === 'body') throw failure; return fixture.bytes; } });
    fixture.options.context.decodeAudioData = async () => { throw failure; };
    await assert.rejects(prepareTrack('/song.wav', fixture.options), stage === 'http' ? /HTTP 503/ : failure);
    assert.deepEqual(fixture.phases, stage === 'decode' ? ['downloading', 'decoding'] : ['downloading']);
  }
});
