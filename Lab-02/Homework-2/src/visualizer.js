/** Draw frequency data without queue updates or layout reads in the frame loop. */
export function createVisualizer(canvas, analyser) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('A 2D canvas is required for the visualizer.');
  let data = new Uint8Array(analyser.frequencyBinCount);
  let width = 0;
  let height = 0;
  let frameId = null;
  let running = false;
  let disposed = false;
  const events = new AbortController();

  function paint() {
    if (data.length !== analyser.frequencyBinCount) data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    context.clearRect(0, 0, width, height);
    const bars = Math.min(80, data.length);
    const stride = data.length / bars;
    const gap = 3;
    const barWidth = Math.max(1, width / bars - gap);
    for (let index = 0; index < bars; index += 1) {
      let peak = 0;
      for (let bin = Math.floor(index * stride); bin < Math.floor((index + 1) * stride); bin += 1) {
        peak = Math.max(peak, data[bin]);
      }
      const barHeight = Math.max(2, (peak / 255) ** 1.4 * (height - 10));
      context.fillStyle = index % 5 === 0 ? '#a8e3d4' : '#45b79d';
      context.fillRect(index * width / bars, height - barHeight, barWidth, barHeight);
    }
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (!running) paint();
  }

  function frame() {
    frameId = null;
    if (!running || disposed) return;
    paint();
    frameId = requestAnimationFrame(frame);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener('resize', resize, { signal: events.signal });
  resize();

  function stop() {
    running = false;
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
  }

  return {
    start() {
      if (running || disposed) return;
      running = true;
      frameId = requestAnimationFrame(frame);
    },
    stop,
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      observer.disconnect();
      events.abort();
      context.clearRect(0, 0, width, height);
    },
  };
}
