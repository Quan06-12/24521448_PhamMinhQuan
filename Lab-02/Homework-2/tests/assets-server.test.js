import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { tracks } from '../src/tracks.js';

test('catalog WAV files have valid PCM headers, durations and unclipped samples', async () => {
  assert.equal(new Set(tracks.map(({ id }) => id)).size, tracks.length);
  for (const item of tracks) {
    const bytes = await readFile(new URL(`../${item.url}`, import.meta.url));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.readUInt32LE(4), bytes.length - 8);
    assert.equal(bytes.toString('ascii', 8, 16), 'WAVEfmt ');
    assert.equal(bytes.readUInt16LE(20), 1);
    assert.equal(bytes.readUInt16LE(22), 1);
    assert.equal(bytes.readUInt16LE(34), 16);
    const dataLength = bytes.readUInt32LE(40);
    assert.equal(dataLength, bytes.length - 44);
    assert.equal(dataLength / bytes.readUInt32LE(28), item.duration);
    let peak = 0;
    for (let offset = 44; offset < bytes.length; offset += 2) peak = Math.max(peak, Math.abs(bytes.readInt16LE(offset)));
    assert.ok(peak > 0 && peak < 32767);
    assert.equal(bytes.readInt16LE(44), 0);
  }
});

test('static server serves the catalog and admits its root while blocking traversal', async (t) => {
  const child = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: new URL('../', import.meta.url), env: { ...process.env, PORT: '18102' }, stdio: ['ignore', 'pipe', 'pipe'] });
  t.after(() => child.kill());
  await once(child.stdout, 'data');
  const base = 'http://127.0.0.1:18102';
  const root = await fetch(`${base}/`);
  assert.ok([200, 404].includes(root.status), `root request should reach index lookup, got ${root.status}`);
  const audio = await fetch(`${base}/assets/soft-current.wav`);
  assert.equal(audio.status, 200);
  assert.equal(audio.headers.get('content-type'), 'audio/wav');
  assert.equal(audio.headers.get('cache-control'), 'no-store');
  assert.equal((await audio.arrayBuffer()).byteLength, 529244);
  assert.equal((await fetch(`${base}/..%2fpackage.json`)).status, 403);
  assert.equal((await fetch(`${base}/missing.wav`)).status, 404);
});
