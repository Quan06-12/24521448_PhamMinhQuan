import { useEffect, useState } from 'react';
import { requestJson } from '../api.js';

// Loads profiles and the saved swipe history in parallel.
// status: 'loading' | 'ready' | 'error'
export function useDeckData() {
  const [state, setState] = useState({ status: 'loading', profiles: [], swipes: [], error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    // One controller for both requests; cleanup aborts them on unmount / retry
    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([requestJson('/profiles', { signal }), requestJson('/swipes', { signal })])
      .then(([profiles, swipes]) => setState({ status: 'ready', profiles, swipes, error: null }))
      .catch((err) => {
        // Expected when the component unmounts (or StrictMode re-runs the effect)
        if (err.name === 'AbortError') return;
        setState({ status: 'error', profiles: [], swipes: [], error: err.message });
      });

    return () => controller.abort();
  }, [attempt]);

  // Retry from an event handler: switch to loading here, not inside the effect
  const retry = () => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    setAttempt((n) => n + 1);
  };

  return { ...state, retry };
}