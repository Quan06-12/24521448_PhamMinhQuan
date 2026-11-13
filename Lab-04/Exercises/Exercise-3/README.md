# Exercise 3 — Full-Stack `useForumMessages` Hook & Live Channel Switcher

Ex 1.7.1: custom data hook with `AbortController` cleanup talking to an Express REST API.

## Structure

```text
Exercise-3/
├── server/   # Express 5 + CORS, GET/POST /api/messages/:forum (port 3001)
└── client/   # React 19 + Vite, useForumMessages hook + channel switcher (port 5173)
```

## Run locally (two terminals)

```sh
# Terminal 1 – API
cd server
npm install
npm run dev

# Terminal 2 – client
cd client
npm install
npm run dev
```

The server adds `LATENCY_MS` (default 800 ms) to GET responses so cancellation is visible.

## Scope

- `useForumMessages(channelId)`: one `AbortController` per request, `abort()` in cleanup,
  `AbortError` ignored, other errors surfaced. Results are tagged with their channel, so
  `loading` is derived and a late response can never overwrite a newer channel (no stale data).
- `postMessage(payload)` helper: POST JSON, throws the server's error message on non-2xx.
- Channel switcher (`nasa`, `esports-tribunal`, `notNasa`) with `aria-pressed`.
- Messages rendered as `<dl>` with `<Fragment key={msg.id}>`; skeleton with `aria-busy`.
- Server: CORS restricted to `http://localhost:5173`, `express.json({ limit: '10kb' })`,
  400 on missing `author` / `text` or text > 500 chars, ids from `crypto.randomUUID()`,
  404 for unknown forums/routes, JSON error handler (no HTML stack traces).

## Verification (Sprint 3)

| Check | Result |
|---|---|
| DevTools Slow 3G, click channels rapidly: earlier requests show `(canceled)` | Pass |
| Only the last selected channel's messages are rendered | Pass |
| Post a message → appears immediately, server returns 201 with UUID | Pass |
| Empty author / text → client alert, no request sent | Pass |
| `curl -X POST ... -d '{"author":"Q"}'` → 400 `Missing required fields` | Pass |
| Malformed JSON body → 400 JSON error, logged by the server | Pass |
| Stop the server → "Could not load messages: Failed to fetch" alert, no crash | Pass |
| `Access-Control-Allow-Origin: http://localhost:5173` only | Pass |
| `npm run lint` (client) | 0 problems |

Note: in development, `<StrictMode>` mounts effects twice, so the very first request on page
load also appears as `(canceled)` — this is the cleanup working as intended.

Screenshots and the server error log are included in the submitted Word report.
