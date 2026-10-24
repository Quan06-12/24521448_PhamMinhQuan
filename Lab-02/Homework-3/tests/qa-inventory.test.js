import test from 'node:test';
import assert from 'node:assert/strict';
import { createInventoryStore } from '../src/inventory.js';

const product = (total = 3) => ({ id: 'tea', name: 'Vietnam tea', total, price: 80_000, originalPrice: 100_000 });
function fixture({ total = 3, saleEndsAt = 10_000, reservationMs = 1000 } = {}) {
  let time = 0;
  let request = 0;
  const store = createInventoryStore({ products: [product(total)], saleEndsAt, reservationMs, now: () => time });
  return {
    store,
    at: (next) => { time = next; },
    reserve: (overrides = {}) => store.reserve({ productId: 'tea', buyer: 'QA', quantity: 1, expectedVersion: store.snapshot().products[0].version, requestId: `qa-${++request}`, ...overrides }),
  };
}

test('QA: one winner for simultaneous attempts using one inventory version', async () => {
  const { store, reserve } = fixture({ total: 1 });
  const results = await Promise.all(Array.from({ length: 100 }, () => Promise.resolve().then(() => reserve({ expectedVersion: 0 }))));
  assert.equal(results.filter((result) => result.ok).length, 1);
  assert.equal(results.filter((result) => result.code === 'CONFLICT').length, 99);
  assert.deepEqual(store.snapshot().products.map(({ available, held, sold }) => ({ available, held, sold })), [{ available: 0, held: 1, sold: 0 }]);
  assert.equal(store.verifyInvariants(), true);
});

test('QA: lock expires at equality and returned stock can be reserved again', () => {
  const { store, reserve, at } = fixture({ total: 1 });
  const first = reserve();
  at(999);
  assert.equal(store.snapshot().reservations[0].status, 'RESERVED');
  at(1000);
  assert.equal(store.sweep(), true);
  assert.equal(store.sweep(), false);
  assert.equal(store.snapshot().reservations[0].status, 'EXPIRED');
  assert.equal(store.release(first.reservation.id).code, 'EXPIRED');
  assert.equal(reserve().ok, true);
  assert.equal(store.verifyInvariants(), true);
});

test('QA: sale expiry truncates holds and prohibits reservation at equality', () => {
  const { store, reserve, at } = fixture({ saleEndsAt: 500, reservationMs: 1000 });
  assert.equal(reserve().reservation.expiresAt, 500);
  at(500);
  assert.equal(reserve().code, 'SALE_ENDED');
  assert.equal(store.snapshot().products[0].available, 3);
  assert.equal(store.snapshot().products[0].held, 0);
});

test('QA: replay is immutable and cannot be reused for another intent', () => {
  const { store, reserve } = fixture();
  const options = { requestId: 'same-key', expectedVersion: 0 };
  const first = reserve(options);
  assert.equal(reserve(options), first);
  assert.equal(reserve({ ...options, quantity: 2 }).code, 'KEY_REUSED');
  assert.equal(store.snapshot().products[0].held, 1);
  assert.throws(() => { first.reservation.quantity = 99; }, TypeError);
  assert.throws(() => { store.snapshot().products[0].available = 99; }, TypeError);
  assert.throws(() => { store.snapshot().reservations.push({}); }, TypeError);
  store.release(first.reservation.id);
  assert.equal(reserve(options), first, 'replay returns documented original outcome even after release');
  assert.equal(store.snapshot().products[0].held, 0);
});

test('QA: malformed quantities and identities cannot change stock', () => {
  const { store, reserve } = fixture();
  for (const quantity of [0, -1, 1.5, NaN, Infinity, '1', Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(reserve({ quantity }).code, 'INVALID');
  }
  for (const buyer of ['', '   ', null, 5, 'x'.repeat(129)]) assert.equal(reserve({ buyer }).code, 'INVALID');
  for (const expectedVersion of [-1, 1.1, NaN, Infinity, '0']) assert.equal(reserve({ expectedVersion }).code, 'INVALID');
  assert.equal(store.reserve(null).code, 'INVALID');
  assert.equal(reserve({ productId: 'missing' }).code, 'NOT_FOUND');
  assert.equal(reserve({ quantity: 4 }).code, 'SOLD_OUT');
  assert.equal(store.snapshot().products[0].available, 3);
});

test('QA: repeated release does not increment version or return stock twice', () => {
  const { store, reserve } = fixture();
  const first = reserve();
  assert.equal(store.release(first.reservation.id).ok, true);
  const state = store.snapshot();
  assert.equal(store.release(first.reservation.id).ok, true);
  assert.deepEqual(store.snapshot(), state);
  assert.equal(store.release('missing').code, 'NOT_FOUND');
});

test('QA: 1000 deterministic mixed operations preserve inventory conservation', () => {
  const { store, reserve, at } = fixture({ total: 37, saleEndsAt: 1_000_000 });
  let seed = 42;
  let time = 0;
  const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed; };
  const ids = [];
  for (let step = 0; step < 1000; step++) {
    const choice = rand() % 4;
    if (choice < 2) {
      const result = reserve({ quantity: 1 + (rand() % 5) });
      if (result.ok) ids.push(result.reservation.id);
    } else if (choice === 2 && ids.length) store.release(ids[rand() % ids.length]);
    else { time += rand() % 100; at(time); store.sweep(); }
    assert.equal(store.verifyInvariants(), true);
    const { available, held, sold, total } = store.snapshot().products[0];
    assert.equal(available + held + sold, total);
  }
});

test('QA: catalog caller cannot mutate inventory values after construction', () => {
  const item = product();
  const store = createInventoryStore({ products: [item], saleEndsAt: 1000, now: () => 0 });
  item.total = 100;
  item.id = 'changed';
  assert.equal(store.snapshot().products[0].total, 3);
  assert.equal(store.snapshot().products[0].id, 'tea');
  assert.throws(() => createInventoryStore({ products: [product(), product()], saleEndsAt: 1000 }), TypeError);
});

test('QA regression: invalid injected clocks cannot create immortal inventory holds', () => {
  let time = 0;
  const store = createInventoryStore({ products: [product()], saleEndsAt: 1000, now: () => time });
  const before = store.snapshot();
  for (const invalidTime of [NaN, Infinity, -Infinity, '100']) {
    time = invalidTime;
    assert.throws(() => store.reserve({ productId: 'tea', buyer: 'QA', quantity: 1, expectedVersion: 0, requestId: 'bad-clock' }), /finite timestamp/);
    assert.throws(() => store.sweep(), /finite timestamp/);
  }
  time = 0;
  assert.deepEqual(store.snapshot(), before);
  assert.throws(() => createInventoryStore({ products: [product()], saleEndsAt: 1000, now: null }), TypeError);
});

test('QA regression: one operation uses a single clock sample for expiry and reservation', () => {
  let calls = 0;
  const store = createInventoryStore({ products: [product()], saleEndsAt: 500, reservationMs: 1000, now: () => 499 + calls++ });
  const result = store.reserve({ productId: 'tea', buyer: 'QA', quantity: 1, expectedVersion: 0, requestId: 'one-sample' });
  assert.equal(calls, 1, 'one timestamp is the operation linearization point');
  assert.equal(result.code, 'RESERVED');
  assert.equal(result.reservation.expiresAt, 500);
  assert.equal(store.snapshot().reservations[0].status, 'EXPIRED');
});
