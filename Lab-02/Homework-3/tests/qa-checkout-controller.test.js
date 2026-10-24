import test from 'node:test';
import assert from 'node:assert/strict';
import { createInventoryStore } from '../src/inventory.js';
import { createCheckoutController } from '../src/checkout.js';

function fixture() {
  let time = 0;
  let next = 0;
  const callbacks = new Map();
  const cancelled = new Set();
  const changes = [];
  const store = createInventoryStore({ products: [{ id: 'tea', name: 'Tea', total: 2, price: 1, originalPrice: 2 }], saleEndsAt: 10_000, reservationMs: 1000, now: () => time });
  const controller = createCheckoutController({ store, onChange: (result) => changes.push(result.code), schedule: (callback) => { callbacks.set(++next, callback); return next; }, unschedule: (id) => cancelled.add(id) });
  let request = 0;
  return { store, controller, changes, cancelled, callbacks,
    at: (value) => { time = value; },
    fire: (id) => callbacks.get(id)(),
    reserve: () => store.reserve({ productId: 'tea', buyer: 'QA', quantity: 1, expectedVersion: store.snapshot().products[0].version, requestId: `controller-${++request}` }).reservation,
  };
}

test('QA controller: duplicate starts share one timer and completion sells once', async () => {
  const f = fixture();
  const hold = f.reserve();
  const first = f.controller.checkout(hold.id);
  assert.equal(f.controller.checkout(hold.id), first);
  assert.equal(f.callbacks.size, 1);
  assert.equal(f.controller.pendingCount, 1);
  f.fire(1);
  assert.equal((await first).code, 'PURCHASED');
  f.fire(1);
  assert.deepEqual(f.changes, ['CHECKING_OUT', 'PURCHASED']);
  assert.equal(f.controller.pendingCount, 0);
  assert.equal(f.store.snapshot().products[0].sold, 1);
});

test('QA controller: cancel settles promise and already queued callback cannot resurrect release', async () => {
  const f = fixture();
  const hold = f.reserve();
  const promise = f.controller.checkout(hold.id);
  assert.equal(f.controller.cancel(hold.id).code, 'RELEASED');
  assert.equal((await promise).code, 'RELEASED');
  assert.equal(f.cancelled.has(1), true);
  f.fire(1);
  assert.equal(f.controller.pendingCount, 0);
  assert.equal(f.store.snapshot().products[0].sold, 0);
  assert.deepEqual(f.changes, ['CHECKING_OUT', 'RELEASED']);
});

test('QA controller: late response expires and failed payment can start a fresh attempt', async () => {
  const f = fixture();
  const hold = f.reserve();
  const failure = f.controller.checkout(hold.id, { succeeds: false });
  f.fire(1);
  assert.equal((await failure).code, 'PAYMENT_FAILED');
  const retry = f.controller.checkout(hold.id);
  f.at(1000);
  f.fire(2);
  assert.equal((await retry).code, 'EXPIRED');
  assert.equal(f.store.snapshot().products[0].available, 2);
});

test('QA controller: disposal clears all pending payments and blocks new checkout', async () => {
  const f = fixture();
  const a = f.reserve();
  const b = f.reserve();
  const promises = [f.controller.checkout(a.id), f.controller.checkout(b.id)];
  f.controller.dispose();
  f.controller.dispose();
  assert.deepEqual((await Promise.all(promises)).map((result) => result.code), ['RELEASED', 'RELEASED']);
  f.fire(1); f.fire(2);
  assert.equal(f.controller.pendingCount, 0);
  assert.equal(f.cancelled.size, 2);
  assert.deepEqual(f.changes, ['CHECKING_OUT', 'CHECKING_OUT']);
  assert.equal((await f.controller.checkout(f.reserve().id)).code, 'INVALID');
  assert.equal(f.store.verifyInvariants(), true);
});

test('QA controller: invalid payment options do not begin checkout or schedule work', async () => {
  const f = fixture();
  const hold = f.reserve();
  for (const delayMs of [-1, 0.5, NaN, Infinity, '5']) assert.equal((await f.controller.checkout(hold.id, { delayMs })).code, 'INVALID');
  assert.equal((await f.controller.checkout(hold.id, { succeeds: 'true' })).code, 'INVALID');
  assert.equal(f.callbacks.size, 0);
  assert.equal(f.store.snapshot().reservations[0].status, 'RESERVED');
});

test('QA regression: rejected checkout reports expiry consumed before the next animation frame', async () => {
  const f = fixture();
  const hold = f.reserve();
  const lastRendered = f.store.snapshot();
  f.at(1000);
  assert.equal((await f.controller.checkout(hold.id)).code, 'EXPIRED');
  assert.equal(f.store.sweep(), false, 'beginCheckout already consumed the expiry transition');
  assert.equal(lastRendered.reservations[0].status, 'RESERVED', 'a view snapshot requires an observer render to refresh');
  assert.deepEqual(f.changes, ['EXPIRED'], 'the UI must receive the failed begin outcome');
  assert.equal(f.callbacks.size, 0);
});
