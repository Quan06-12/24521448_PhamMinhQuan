/** A frame is a redraw opportunity, never a unit of elapsed time. */
export function createDeadlineTimer({
  deadline,
  onTick,
  onComplete = () => {},
  now = Date.now,
  requestFrame = requestAnimationFrame,
  cancelFrame = cancelAnimationFrame,
}) {
  if (!Number.isFinite(deadline) || typeof onTick !== 'function' || typeof now !== 'function') {
    throw new TypeError('A finite deadline and onTick callback are required.');
  }
  let frameId = null;
  let stopped = false;
  function stop() {
    stopped = true;
    if (frameId !== null) cancelFrame(frameId);
    frameId = null;
  }
  function tick() {
    frameId = null;
    if (stopped) return;
    const time = now();
    if (!Number.isFinite(time)) {
      stop();
      throw new TypeError('The timer clock must return a finite timestamp.');
    }
    const remaining = Math.max(0, deadline - time);
    onTick(remaining);
    if (stopped) return;
    if (remaining === 0) {
      stopped = true;
      onComplete();
      return;
    }
    frameId = requestFrame(tick);
  }
  frameId = requestFrame(tick);
  return stop;
}

export function formatRemaining(milliseconds) {
  const value = Math.max(0, Math.ceil(milliseconds));
  const minutes = Math.floor(value / 60_000);
  const seconds = Math.floor((value % 60_000) / 1000);
  const millis = value % 1000;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}
