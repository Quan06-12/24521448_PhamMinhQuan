// Base URL of the Express API (override with VITE_API_URL in client/.env)
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3002/api';

// fetch wrapper: JSON in/out, throws the server's { error } message on non-2xx
export async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error ?? `HTTP ${res.status}`);
  }
  return body;
}