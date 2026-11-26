import { useEffect, useState } from 'react';
import { requestJson } from '../api.js';

// GET a JSON resource and re-fetch when `path` changes.
// The result is tagged with the path it belongs to, so `loading` is derived: while the stored
// path differs from the requested one, the old data is hidden (no stale dossier after navigation).
export function useJson(path) {
  const [result, setResult] = useState({ path: null, data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    requestJson(path, { signal: controller.signal })
      .then((data) => setResult({ path, data, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return; // navigation or unmount cancelled it
        setResult({ path, data: null, error: { message: err.message, status: err.status ?? 0 } });
      });
    return () => controller.abort();
  }, [path, attempt]);

  const loading = result.path !== path;
  return {
    loading,
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    // Retry from an event handler: forget the stored result, then bump the attempt counter
    retry: () => {
      setResult({ path: null, data: null, error: null });
      setAttempt((n) => n + 1);
    },
    // Replace the data in place (used after a successful POST)
    update: (updater) => setResult((prev) => ({ ...prev, data: updater(prev.data) })),
  };
}