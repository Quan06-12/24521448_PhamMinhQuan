import test from 'node:test';
import assert from 'node:assert/strict';
import { fakeContext, flush } from './helpers.js';

// This executes the real application against injected DOM/audio doubles; it is not a browser test.
test('delegated controls report resume errors and pagehide/restore release and recreate owned audio', async (t) => {
  const names = ['window', 'document', 'AudioContext', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame', 'fetch'];
  const originals = new Map(names.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  t.after(() => { for (const name of names) { const descriptor = originals.get(name); if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name]; } });
  class Node extends EventTarget {
    constructor() { super(); this.children = []; this.dataset = {}; this.attributes = {}; this.textContent = ''; this.disabled = false; }
    append(...nodes) { this.children.push(...nodes); nodes.forEach((node) => node.parent = this); }
    setAttribute(name, value) { this.attributes[name] = value; }
    closest() { return this; }
    remove() { this.parent.children = this.parent.children.filter((node) => node !== this); }
    replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
    getBoundingClientRect() { return { width: 640, height: 180 }; }
    getContext() { return { clearRect() {}, fillRect() {}, setTransform() {} }; }
  }
  const document = new EventTarget();
  const nodes = new Map(['main', '#catalog', '#queue-list', '#notice', '#bins', '#volume', '#volume-value', '#spectrum', '#queue-count', '#empty-state', '#preparing-status', '#cancel-all-button', '#clear-button', '#play-button', '#player-title', '#player-subtitle', '#play-state'].map((id) => [id, new Node()]));
  nodes.get('#bins').value = '256';
  nodes.get('#volume').value = '65';
  document.querySelector = (selector) => { assert.ok(nodes.has(selector), `known UI target ${selector}`); return nodes.get(selector); };
  document.createElement = () => new Node();
  document.hidden = false;
  globalThis.document = document;
  const window = new EventTarget();
  window.devicePixelRatio = 1;
  globalThis.window = window;
  const contexts = [];
  globalThis.AudioContext = window.AudioContext = function () {
    const context = fakeContext();
    context.decodeAudioData = async () => ({ duration: 12 });
    contexts.push(context);
    return context;
  };
  let observerDisconnects = 0;
  globalThis.ResizeObserver = class { observe() {} disconnect() { observerDisconnects += 1; } };
  const frames = new Map();
  let id = 0;
  globalThis.requestAnimationFrame = (callback) => { frames.set(++id, callback); return id; };
  globalThis.cancelAnimationFrame = (frame) => frames.delete(frame);
  globalThis.fetch = async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
  await import('../src/app.js');
  assert.equal(nodes.get('#catalog').children.length, 3);
  const click = async (action, values = {}) => {
    const button = new Node();
    button.dataset = { action, ...values };
    const event = new Event('click');
    Object.defineProperty(event, 'target', { value: button });
    nodes.get('main').dispatchEvent(event);
    await flush();
  };
  await click('add', { track: 'soft-current' });
  assert.equal(nodes.get('#queue-count').textContent, '1');
  assert.equal(contexts[0].sources.length, 0, 'preparation before play does not start audio');
  contexts[0].resume = async () => { throw new Error('gesture denied'); };
  await click('play');
  assert.match(nodes.get('#notice').textContent, /gesture denied/);
  assert.equal(nodes.get('#play-button').disabled, false, 'resume can be retried');
  contexts[0].resume = async () => { contexts[0].state = 'running'; };
  await click('play');
  assert.equal(contexts[0].sources.length, 1);
  assert.equal(frames.size, 1);
  document.hidden = true;
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(frames.size, 0);
  document.hidden = false;
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal(frames.size, 1);
  await click('cancel-all');
  assert.equal(contexts[0].sources[0].stops, 1);
  assert.equal(contexts[0].sources[0].buffer, null);
  assert.equal(frames.size, 0);
  await click('add', { track: 'after-hours' });
  assert.equal(contexts[0].sources.length, 2);
  window.dispatchEvent(new Event('pagehide'));
  await flush();
  assert.equal(contexts[0].state, 'closed');
  assert.equal(contexts[0].sources[1].stops, 1);
  assert.equal(contexts[0].sources[1].buffer, null);
  assert.equal(contexts[0].sources[1].onended, null);
  assert.equal(frames.size, 0);
  assert.equal(nodes.get('#queue-list').children.length, 0);
  const restored = new Event('pageshow');
  Object.defineProperty(restored, 'persisted', { value: true });
  window.dispatchEvent(restored);
  assert.equal(nodes.get('#queue-count').textContent, '0');
  assert.equal(nodes.get('#empty-state').hidden, false);
  await click('add', { track: 'first-light' });
  assert.equal(contexts.length, 2, 'restored document creates fresh context');
  assert.equal(contexts[1].sources.length, 0);
  assert.equal(nodes.get('#queue-list').children.length, 1);
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  await click('add', { track: 'after-hours' });
  assert.match(nodes.get('#notice').textContent, /After Hours failed:.*HTTP 503/);
  window.dispatchEvent(new Event('pagehide'));
  await flush();
  assert.equal(contexts[1].state, 'closed');
  assert.equal(observerDisconnects, 2);
});
