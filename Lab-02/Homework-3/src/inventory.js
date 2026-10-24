const ACTIVE = new Set(['RESERVED', 'CHECKING_OUT']);
const copy = (value) => Object.freeze({ ...value });
const text = (value) => typeof value === 'string' && value.trim().length > 0 && value.length <= 128;

/** A single in-memory authority, not a server or a cross-tab lock. */
export function createInventoryStore({ products, saleEndsAt, reservationMs = 15_000, now = Date.now }) {
  if (!Array.isArray(products) || !products.length || !Number.isFinite(saleEndsAt)
    || !Number.isSafeInteger(reservationMs) || reservationMs <= 0 || typeof now !== 'function') {
    throw new TypeError('Products, a sale deadline and a positive reservation duration are required.');
  }
  const stock = new Map();
  for (const product of products) {
    if (!text(product.id) || !text(product.name) || stock.has(product.id)
      || !Number.isSafeInteger(product.total) || product.total < 0
      || !Number.isSafeInteger(product.price) || product.price < 0
      || !Number.isSafeInteger(product.originalPrice) || product.originalPrice < product.price) {
      throw new TypeError('Product IDs must be unique and stock/prices must be nonnegative integers.');
    }
    stock.set(product.id, { ...product, available: product.total, held: 0, sold: 0, version: 0 });
  }
  const reservations = new Map();
  const requests = new Map();
  let sequence = 0;

  function result(ok, code, reservation) {
    return Object.freeze({ ok, code, ...(reservation ? { reservation: copy(reservation) } : {}) });
  }
  function transition(reservation, next) {
    const product = stock.get(reservation.productId);
    const wasActive = ACTIVE.has(reservation.status);
    const isActive = ACTIVE.has(next);
    if (wasActive && !isActive) {
      product.held -= reservation.quantity;
      if (next === 'PURCHASED') product.sold += reservation.quantity;
      else product.available += reservation.quantity;
    }
    reservation.status = next;
    product.version++;
    verifyInvariants();
  }
  function readTime() {
    const time = now();
    if (!Number.isFinite(time)) throw new TypeError('The inventory clock must return a finite timestamp.');
    return time;
  }
  function expireAt(time) {
    let changed = false;
    for (const reservation of reservations.values()) {
      if (ACTIVE.has(reservation.status) && (time >= reservation.expiresAt || time >= saleEndsAt)) {
        transition(reservation, 'EXPIRED');
        changed = true;
      }
    }
    return changed;
  }
  function sweep() { return expireAt(readTime()); }
  function snapshot() {
    sweep();
    return Object.freeze({
      saleEndsAt,
      products: Object.freeze([...stock.values()].map(copy)),
      reservations: Object.freeze([...reservations.values()].map(copy)),
    });
  }
  function reserve(request) {
    const time = readTime();
    expireAt(time);
    if (!request || !text(request.requestId) || !text(request.buyer) || !text(request.productId)
      || !Number.isSafeInteger(request.quantity) || request.quantity <= 0
      || !Number.isSafeInteger(request.expectedVersion) || request.expectedVersion < 0) {
      return result(false, 'INVALID');
    }
    const { productId, buyer, quantity, expectedVersion, requestId } = request;
    const fingerprint = JSON.stringify([productId, buyer, quantity, expectedVersion]);
    const previous = requests.get(requestId);
    if (previous) return previous.fingerprint === fingerprint ? previous.result : result(false, 'KEY_REUSED');
    const product = stock.get(productId);
    let outcome;
    if (!product) outcome = result(false, 'NOT_FOUND');
    else if (time >= saleEndsAt) outcome = result(false, 'SALE_ENDED');
    else if (expectedVersion !== product.version) outcome = result(false, 'CONFLICT');
    else if (quantity > product.available) outcome = result(false, 'SOLD_OUT');
    else {
      const reservation = {
        id: `hold-${++sequence}`, productId, buyer, quantity,
        expiresAt: Math.min(time + reservationMs, saleEndsAt), status: 'RESERVED', attempt: 0,
      };
      reservations.set(reservation.id, reservation);
      product.available -= quantity;
      product.held += quantity;
      product.version++;
      verifyInvariants();
      outcome = result(true, 'RESERVED', reservation);
    }
    requests.set(requestId, { fingerprint, result: outcome });
    return outcome;
  }
  function release(id) {
    sweep();
    const reservation = reservations.get(id);
    if (!reservation) return result(false, 'NOT_FOUND');
    if (reservation.status === 'RELEASED') return result(true, 'RELEASED', reservation);
    if (!ACTIVE.has(reservation.status)) return result(false, reservation.status === 'EXPIRED' ? 'EXPIRED' : 'STALE', reservation);
    transition(reservation, 'RELEASED');
    return result(true, 'RELEASED', reservation);
  }
  function verifyInvariants() {
    for (const product of stock.values()) {
      const values = [product.available, product.held, product.sold];
      const held = [...reservations.values()]
        .filter((reservation) => reservation.productId === product.id && ACTIVE.has(reservation.status))
        .reduce((sum, reservation) => sum + reservation.quantity, 0);
      const sold = [...reservations.values()]
        .filter((reservation) => reservation.productId === product.id && reservation.status === 'PURCHASED')
        .reduce((sum, reservation) => sum + reservation.quantity, 0);
      if (values.some((value) => !Number.isSafeInteger(value) || value < 0)
        || values.reduce((sum, value) => sum + value, 0) !== product.total
        || held !== product.held || sold !== product.sold) throw new Error(`Stock invariant failed: ${product.id}`);
    }
    return true;
  }
  return Object.freeze({ snapshot, reserve, release, sweep, verifyInvariants });
}
