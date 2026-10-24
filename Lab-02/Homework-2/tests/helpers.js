export function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

export async function flush() {
  for (let index = 0; index < 12; index += 1) await Promise.resolve();
}

export function track(id) {
  return { id, title: `Track ${id}`, artist: 'QA fixture', url: `/${id}.wav`, duration: 1, mood: 'test' };
}

export function fakeContext() {
  const sources = [];
  const nodes = [];
  function node() {
    const value = {
      connections: [], disconnects: 0,
      connect(target) { this.connections.push(target); return target; },
      disconnect() { this.connections = []; this.disconnects += 1; },
    };
    nodes.push(value);
    return value;
  }
  const context = {
    state: 'suspended', currentTime: 0, sources, nodes, destination: {},
    resumeCalls: 0,
    async resume() { this.resumeCalls += 1; this.state = 'running'; },
    async close() { this.state = 'closed'; },
    createAnalyser() {
      const analyser = Object.assign(node(), {
        fftSize: 512, smoothingTimeConstant: 0,
        getByteFrequencyData(target) { target.fill(10); },
      });
      Object.defineProperty(analyser, 'frequencyBinCount', { get() { return this.fftSize / 2; } });
      return analyser;
    },
    createGain() {
      return Object.assign(node(), { gain: { value: 1, setValueAtTime(value) { this.value = value; }, setTargetAtTime(value) { this.value = value; } } });
    },
    createBufferSource() {
      const source = Object.assign(node(), {
        buffer: null, onended: null, starts: 0, stops: 0,
        start() { this.starts += 1; },
        stop() { this.stops += 1; },
        finish() { this.onended?.(); },
      });
      sources.push(source);
      return source;
    },
  };
  return context;
}
