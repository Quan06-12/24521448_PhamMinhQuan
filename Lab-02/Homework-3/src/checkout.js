/** Owns simulated payment timers; the inventory store remains authoritative. */
export function createCheckoutController({ store, onChange = () => {}, schedule = setTimeout, unschedule = clearTimeout }) {
  const pending = new Map();
  let disposed = false;
  const invalid = () => Object.freeze({ ok: false, code: 'INVALID' });

  function checkout(reservationId, { delayMs = 800, succeeds = true } = {}) {
    if (disposed || !Number.isSafeInteger(delayMs) || delayMs < 0 || typeof succeeds !== 'boolean') {
      return Promise.resolve(invalid());
    }
    if (pending.has(reservationId)) return pending.get(reservationId).promise;
    const started = store.beginCheckout(reservationId);
    if (!started.ok) {
      // beginCheckout can expire a hold; the view must observe that mutation too.
      onChange(started);
      return Promise.resolve(started);
    }
    let resolve;
    const promise = new Promise((done) => { resolve = done; });
    const entry = { promise, resolve, timer: null };
    pending.set(reservationId, entry);
    entry.timer = schedule(() => {
      if (pending.get(reservationId) !== entry) return;
      pending.delete(reservationId);
      const result = store.finishCheckout(started.token, succeeds);
      resolve(result);
      onChange(result);
    }, delayMs);
    onChange(started);
    return promise;
  }

  function cancel(reservationId) {
    const entry = pending.get(reservationId);
    const result = store.release(reservationId);
    if (entry) {
      pending.delete(reservationId);
      unschedule(entry.timer);
      entry.resolve(result);
    }
    if (!disposed) onChange(result);
    return result;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    for (const id of [...pending.keys()]) cancel(id);
  }

  return Object.freeze({ checkout, cancel, dispose, get pendingCount() { return pending.size; } });
}
