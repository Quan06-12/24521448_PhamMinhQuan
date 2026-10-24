/** All shoppers first read the same version, then losers retry once with a fresh read. */
export async function runShopperRace({ store, productId, shoppers = 20, runId, isCancelled = () => false }) {
  if (!Number.isSafeInteger(shoppers) || shoppers < 1 || shoppers > 100
    || typeof runId !== 'string' || !runId || runId.length > 80) {
    throw new TypeError('A unique run ID and between 1 and 100 shoppers are required.');
  }
  const initial = store.snapshot().products.find((product) => product.id === productId);
  if (!initial) throw new TypeError('Unknown race product.');
  const held = new Set();
  let purchased = 0;
  const request = (index, version, pass) => store.reserve({
    productId, buyer: `Shopper ${index + 1}`, quantity: 1,
    expectedVersion: version, requestId: `${runId}-${index}-${pass}`,
  });
  const results = await Promise.all(Array.from({ length: shoppers }, (_, index) => Promise.resolve().then(() => {
    if (isCancelled()) return { ok: false, code: 'STALE' };
    const outcome = request(index, initial.version, 'first');
    if (outcome.ok) held.add(outcome.reservation.id);
    return outcome;
  })));
  const firstPassWins = results.filter((result) => result.ok).length;
  const conflicts = results.filter((result) => result.code === 'CONFLICT').length;
  try {
    for (let index = 0; index < shoppers; index++) {
      if (isCancelled()) break;
      let outcome = results[index];
      if (outcome.code === 'CONFLICT') {
        const current = store.snapshot().products.find((product) => product.id === productId);
        outcome = request(index, current.version, 'retry');
        if (outcome.ok) held.add(outcome.reservation.id);
      }
      if (outcome.ok) {
        const begun = store.beginCheckout(outcome.reservation.id);
        if (begun.ok && store.finishCheckout(begun.token, true).ok) purchased++;
      }
    }
  } finally {
    for (const id of held) store.release(id);
    store.verifyInvariants();
  }
  return Object.freeze({ attempted: shoppers, firstPassWins, conflicts, purchased, rejected: shoppers - purchased });
}
