import { INITIAL_DROPS } from '../domain/drops.js';

const MIN_LATENCY_MS = 400;
const MAX_LATENCY_MS = 900;
const DEFAULT_CONFLICT_RATE = 0.35; // another bot snipes the last item 35% of the time

// The "server" owns the real stock. The client only ever shows a guess until a reply arrives.
const serverStock = new Map(INITIAL_DROPS.map((drop) => [drop.id, drop.remainingStock]));

/** Thrown for HTTP 409 Conflict (looted out / sniped). */
export class ClaimConflictError extends Error {
  constructor(dropId) {
    super(`409 Conflict: ${dropId} was looted out`);
    this.name = 'ClaimConflictError';
    this.status = 409;
  }
}

export function isAbortError(error) {
  return error instanceof DOMException && error.name === 'AbortError';
}

// ?conflict=1 always 409, ?conflict=0 never snipes, ?conflict=0.5 any rate in between.
// Read at call time (not at import) so tests can change the URL flag between loads.
function getConflictRate() {
  const raw = new URLSearchParams(window.location.search).get('conflict');
  if (raw === null || raw.trim() === '') return DEFAULT_CONFLICT_RATE;
  const rate = Number(raw);
  return Number.isFinite(rate) ? Math.min(1, Math.max(0, rate)) : DEFAULT_CONFLICT_RATE;
}

// ?fail=1 makes every claim die like a dropped connection, to test the error path
function shouldFailNetwork() {
  return new URLSearchParams(window.location.search).get('fail') === '1';
}

// Abortable delay: rejects with the signal's reason as soon as abort() is called
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      window.clearTimeout(timerId);
      reject(signal.reason);
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Mock claim endpoint.
 * @param {string} dropId
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{ ok: true, remainingStock: number }>}
 * @throws {ClaimConflictError} when the server has no stock left or the claim was sniped
 * @throws {TypeError} generic network failure (forced with ?fail=1)
 */
export async function claimDrop(dropId, { signal } = {}) {
  await wait(MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS), signal);

  // Same error type a failed fetch() gives, so the client cannot special-case it
  if (shouldFailNetwork()) throw new TypeError('Network request failed');

  const stock = serverStock.get(dropId) ?? 0;
  // Real sold-out always conflicts, even with ?conflict=0
  if (stock <= 0 || Math.random() < getConflictRate()) {
    throw new ClaimConflictError(dropId);
  }

  serverStock.set(dropId, stock - 1);
  return { ok: true, remainingStock: stock - 1 };
}
