import test from 'node:test';
import assert from 'node:assert/strict';
import { fixture } from './dom-fixture.js';

// Runs the actual application entry point with an in-memory DOM and Node event
// target. This checks lifecycle logic; it does not emulate browser BFCache.
test('persisted pagehide preserves interaction; terminal pagehide removes listeners', async () => {
  const dom = fixture();
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  globalThis.document = dom.document;
  globalThis.window = new EventTarget();
  try {
    await import('../src/main.js?lifecycle-test');
    const countListeners = () => [...dom.root.listeners.values()]
      .reduce((count, listeners) => count + listeners.size, 0);
    assert.equal(countListeners(), 5);

    const persisted = new Event('pagehide');
    Object.defineProperty(persisted, 'persisted', { value: true });
    window.dispatchEvent(persisted);
    assert.equal(countListeners(), 5);
    dom.root.querySelector('[data-page="next"]').click();
    assert.equal(dom.root.querySelector('#page-label').textContent, 'Page 2 of 4');

    const terminal = new Event('pagehide');
    Object.defineProperty(terminal, 'persisted', { value: false });
    window.dispatchEvent(terminal);
    assert.equal(countListeners(), 0);
    dom.root.querySelector('[data-page="next"]').click();
    assert.equal(dom.root.querySelector('#page-label').textContent, 'Page 2 of 4');
    window.dispatchEvent(new Event('pagehide'));
    assert.equal(countListeners(), 0);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
