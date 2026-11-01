const RADAR_DELAY_MS = 1200;   // simulated satellite processing time after the HTTP response
const PACKET_LOSS_RATE = 0.35; // slide 22: 35% Erangel/Miramar packet loss

// Abortable delay: rejects with the signal's AbortError as soon as abort() is called
function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timerId = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    function onAbort() {
      window.clearTimeout(timerId);
      reject(signal.reason); // DOMException named 'AbortError'
    }
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/**
 * Fetch one squad's live telemetry. Every step honours the AbortSignal.
 * @param {string} squadId - 'ces' | 'te' | 'ge'
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<{id: string, name: string, map: string, phase: string,
 *   alive: number, kills: number, wwcdProb: string, status: string}>}
 */
export async function fetchKraftonPubgTelemetry(squadId, { signal } = {}) {
  // Real HTTP request: visible (and cancellable) in the DevTools Network tab
  const response = await fetch(`/telemetry/${encodeURIComponent(squadId)}.json`, { signal });
  if (!response.ok) throw new Error(`Telemetry server returned HTTP ${response.status}`);
  const payload = await response.json();

  await wait(RADAR_DELAY_MS, signal);

  if (Math.random() < PACKET_LOSS_RATE) {
    throw new Error('Satellite packet loss over the Blue Zone (simulated 35%)');
  }
  return payload;
}