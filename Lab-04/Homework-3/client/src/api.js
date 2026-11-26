// Base URL of the tribunal API (override with VITE_API_URL in client/.env)
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3003/api';

// fetch wrapper: JSON in/out; on non-2xx throws an Error carrying the HTTP status
export async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const body = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(body?.error ?? `HTTP ${res.status}`);
    error.status = res.status; // lets pages tell "not found" from "server down"
    throw error;
  }
  return body;
}