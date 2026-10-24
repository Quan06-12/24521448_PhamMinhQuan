import test from 'node:test';
import assert from 'node:assert/strict';
import { createInventoryStore } from '../src/inventory.js';
import { runShopperRace } from '../src/race.js';

const storeWith = (total) => createInventoryStore({ products: [{ id: 'tea', name: 'Tea', total, price: 1, originalPrice: 2 }], saleEndsAt: 10_000, now: () => 0 });

test('QA race: one first-version winner and retries buy only available inventory', async () => {
  const store = storeWith(5);
  const result = await runShopperRace({ store, productId: 'tea', shoppers: 20, runId: 'qa-race' });
  assert.deepEqual(result, { attempted: 20, firstPassWins: 1, conflicts: 19, purchased: 5, rejected: 15 });
  assert.deepEqual(store.snapshot().products.map(({ available, held, sold }) => [available, held, sold]), [[0, 0, 5]]);
  assert.equal(store.verifyInvariants(), true);
});

test('QA race: cancellation before and after first wave releases all temporary holds', async () => {
  for (const cancelAfter of [0, 20]) {
    const store = storeWith(5);
    let checks = 0;
    const result = await runShopperRace({ store, productId: 'tea', shoppers: 20, runId: `cancel-${cancelAfter}`, isCancelled: () => ++checks > cancelAfter });
    assert.equal(result.purchased, 0);
    assert.equal(result.firstPassWins, cancelAfter === 0 ? 0 : 1);
    assert.deepEqual(store.snapshot().products.map(({ available, held, sold }) => [available, held, sold]), [[5, 0, 0]]);
    assert.equal(store.verifyInvariants(), true);
  }
});

test('QA race: exhausted inventory and invalid request sizes are explicit', async () => {
  const store = storeWith(0);
  const result = await runShopperRace({ store, productId: 'tea', runId: 'empty' });
  assert.equal(result.purchased, 0);
  assert.equal(result.rejected, 20);
  for (const shoppers of [0, -1, 1.5, 101, NaN]) await assert.rejects(runShopperRace({ store, productId: 'tea', runId: 'invalid', shoppers }), TypeError);
  await assert.rejects(runShopperRace({ store, productId: 'unknown', runId: 'unknown' }), /Unknown race product/);
});
