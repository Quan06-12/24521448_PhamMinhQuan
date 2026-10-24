/** Fetch is abortable; decode is guarded because Web Audio cannot abort it. */
export async function prepareTrack(url, { signal, context, fetchImpl = fetch, onPhase }) {
  signal.throwIfAborted();
  onPhase('downloading');
  const response = await fetchImpl(url, { signal });
  signal.throwIfAborted();
  if (!response.ok) throw new Error(`Download failed (HTTP ${response.status}).`);
  const bytes = await response.arrayBuffer();
  signal.throwIfAborted();
  onPhase('decoding');
  const buffer = await context.decodeAudioData(bytes);
  signal.throwIfAborted();
  return buffer;
}
