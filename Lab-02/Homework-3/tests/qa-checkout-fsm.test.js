import test from 'node:test';
import assert from 'node:assert/strict';
import { createInventoryStore } from '../src/inventory.js';

function fixture({ saleEndsAt = 10_000 } = {}) {
  let time = 0;
  let sequence = 0;
  const store = createInventoryStore({ products: [{ id: 'tea', name: 'Tea', total: 2, price: 1, originalPrice: 2 }], saleEndsAt, reservationMs: 1000, now: () => time });
  return {
    store,
    at: (value) => { time = value; },
    reserve: () => store.reserve({ productId: 'tea', buyer: 'QA', quantity: 1, expectedVersion: store.snapshot().products[0].version, requestId: `fsm-${++sequence}` }),
  };
}

test('QA FSM: simultaneous checkout starts have one winner; duplicate completion cannot sell twice', async () => {
  const { store, reserve } = fixture();
  const hold = reserve().reservation;
  const starts = await Promise.all(Array.from({ length: 10 }, () => Promise.resolve().then(() => store.beginCheckout(hold.id))));
  assert.equal(starts.filter((entry) => entry.ok).length, 1);
  const started = starts.find((entry) => entry.ok);
  assert.throws(() => { started.token.attempt++; }, TypeError);
  assert.equal(store.finishCheckout(started.token, true).code, 'PURCHASED');
  const purchased = store.snapshot();
  assert.equal(store.finishCheckout(started.token, true).code, 'STALE');
  assert.equal(store.release(hold.id).code, 'STALE');
  assert.deepEqual(store.snapshot(), purchased);
  assert.deepEqual(purchased.products.map(({ available, held, sold }) => [available, held, sold]), [[1, 0, 1]]);
});

test('QA FSM: failed payment retains lock and old attempt cannot complete a new attempt', () => {
  const { store, reserve } = fixture();
  const hold = reserve().reservation;
  const first = store.beginCheckout(hold.id);
  const failed = store.finishCheckout(first.token, false);
  assert.equal(failed.ok, false);
  assert.equal(failed.code, 'PAYMENT_FAILED');
  assert.equal(failed.reservation.status, 'RESERVED');
  const next = store.beginCheckout(hold.id);
  assert.equal(next.token.attempt, first.token.attempt + 1);
  const pending = store.snapshot();
  assert.equal(store.finishCheckout(first.token, true).code, 'STALE');
  assert.deepEqual(store.snapshot(), pending);
  assert.equal(store.finishCheckout(next.token, true).code, 'PURCHASED');
  assert.equal(store.verifyInvariants(), true);
});

test('QA FSM: released checkout token cannot purchase replacement reservation', () => {
  const { store, reserve } = fixture();
  const old = reserve().reservation;
  const token = store.beginCheckout(old.id).token;
  store.release(old.id);
  const fresh = reserve().reservation;
  const newToken = store.beginCheckout(fresh.id).token;
  assert.equal(store.finishCheckout(token, true).code, 'STALE');
  assert.equal(store.finishCheckout(newToken, true).code, 'PURCHASED');
  assert.deepEqual(store.snapshot().products.map(({ available, held, sold }) => [available, held, sold]), [[1, 0, 1]]);
});

for (const deadline of [1000, 500]) {
  test(`QA FSM: payment completion at exact ${deadline}ms lock/sale boundary expires`, () => {
    const { store, reserve, at } = fixture({ saleEndsAt: deadline === 500 ? 500 : 10_000 });
    const hold = reserve().reservation;
    const token = store.beginCheckout(hold.id).token;
    at(deadline);
    assert.equal(store.finishCheckout(token, true).code, 'EXPIRED');
    assert.equal(store.beginCheckout(hold.id).code, 'EXPIRED');
    assert.deepEqual(store.snapshot().products.map(({ available, held, sold }) => [available, held, sold]), [[2, 0, 0]]);
  });
}

test('QA FSM: checkout never extends the original reservation deadline', () => {
  const { store, reserve, at } = fixture();
  const hold = reserve().reservation;
  at(900);
  const first = store.beginCheckout(hold.id);
  assert.equal(first.reservation.expiresAt, 1000);
  store.finishCheckout(first.token, false);
  at(999);
  const retry = store.beginCheckout(hold.id);
  assert.equal(retry.reservation.expiresAt, 1000);
  at(1000);
  assert.equal(store.finishCheckout(retry.token, true).code, 'EXPIRED');
});

test('QA FSM: malformed tokens and nonboolean success cannot mutate active checkout', () => {
  const { store, reserve } = fixture();
  const token = store.beginCheckout(reserve().reservation.id).token;
  const before = store.snapshot();
  for (const invalid of [null, {}, { reservationId: token.reservationId, attempt: 0 }, { ...token, attempt: 1.1 }, { ...token, attempt: NaN }]) {
    assert.equal(store.finishCheckout(invalid, true).code, 'INVALID');
  }
  for (const succeeded of [1, 'true', null, undefined]) assert.equal(store.finishCheckout(token, succeeded).code, 'INVALID');
  assert.equal(store.finishCheckout({ ...token, reservationId: 'missing' }, true).code, 'NOT_FOUND');
  assert.equal(store.finishCheckout({ ...token, attempt: 999 }, true).code, 'STALE');
  assert.deepEqual(store.snapshot(), before);
});
