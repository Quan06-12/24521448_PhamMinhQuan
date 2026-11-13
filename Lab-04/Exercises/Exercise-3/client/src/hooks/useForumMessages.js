import { useCallback, useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Fetches one channel's messages and exposes a POST helper.
// Each result is tagged with the channel it belongs to, so "loading" is derived:
// while the stored channel differs from the requested one, data is not ready yet.
export function useForumMessages(channelId) {
  const [result, setResult] = useState({ channelId: null, messages: [], error: null });

  useEffect(() => {
    // One controller per request; cleanup aborts it when the channel changes or on unmount
    const controller = new AbortController();

    fetch(`${API_BASE}/api/messages/${channelId}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
        setResult({ channelId, messages: body, error: null });
      })
      .catch((err) => {
        // A cancelled request is expected (fast channel switching), not a failure
        if (err.name === 'AbortError') return;
        console.error(`[useForumMessages] ${channelId}:`, err);
        setResult({ channelId, messages: [], error: err.message });
      });

    return () => controller.abort();
  }, [channelId]);

  const postMessage = useCallback(
    async (payload) => {
      const res = await fetch(`${API_BASE}/api/messages/${channelId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      // Append only if the user is still on the same channel
      setResult((prev) =>
        prev.channelId === channelId ? { ...prev, messages: [...prev.messages, body] } : prev
      );
      return body;
    },
    [channelId]
  );

  const loading = result.channelId !== channelId;
  return {
    messages: loading ? [] : result.messages,
    error: loading ? null : result.error,
    loading,
    postMessage,
  };
}
