# AI Failure Audit — Lab 05 (Real-Time & Agentic Web)

- **Student:** Pham Minh Quan — **Student ID:** 24521448
- **Approved S3T Stack:** React 19, Vite, Express 5, Mongoose 8, Firebase v10+ Modular SDK, Pusher, W3C WebMCP
- **Audit Protocol:** Any LLM-generated snippet that violates the Lab 5 Verification Contract or introduces deprecated legacy patterns is logged immediately with its **Failure Prompt**, **Root Cause**, **Corrected Diff**, and **Verification Evidence**.

## 1. Audit Summary Matrix

| ID | Hallucination Pattern | Risk Category | Scope | Affected File | Status | Fix Commit |
| --- | --- | --- | --- | --- | --- | --- |
| AUD-01 | The Reactive Loop WebSocket (`[messages]` dep) | `AI AUDIT` / High | Ex 2.1 / Sprint 3 | `client/src/hooks/useRealtimeRoom.js` | Pending | — |
| AUD-02 | Deprecated Firebase v8 Namespaces | `ANTI-PATTERNS` / High | Ex 2.1 / Sprint 3 | `client/src/lib/firebase.js` | Pending | — |
| AUD-03 | Obsolete Mongoose Callbacks & Flags | `ANTI-PATTERNS` / High | Ex 1.2 / Ex 2.2 | `server/routes/reels.js` | Pending | — |
| AUD-04 | Dead UI Dependencies (`react-ticker`, MUI v4) | `ANTI-PATTERNS` / Medium | Ex 1.1 / Ex 3.2 | `client/src/components/ReelCard.jsx` | Pending | — |
| AUD-05 | Unguarded Autonomous Agent Execution (No Consent Gate) | `SECURITY RISKS` / Critical | Ex 3.2 / HW 2 | `client/src/hooks/useWebMcpChatTools.js` | Pending | — |

## 2. Detailed Incident Logs

### [AUD-01] The Reactive Loop WebSocket — `AI AUDIT`
- **Context:** Exercise 2.1 • **AI Tool:** `<Copilot / ChatGPT / ...>` • **File:** `client/src/hooks/useRealtimeRoom.js` • **Fix Commit:** `<commit-hash>`
- **Failure Prompt:**
  > "<Paste the exact prompt that triggered the broken AI snippet>"
- **Root Cause:**
  The LLM placed the `messages` state array inside the `useEffect(..., [roomId, messages])` dependency array to append incoming messages. Every new chat frame mutates `messages`, causing React to re-run the effect, tear down or leak subscriptions, and open cascading Pusher WebSocket connections.
- **Corrected Diff (Approved S3T Standard):**
```diff
- useEffect(() => {
-   const pusher = new Pusher(key, { cluster });
-   const channel = pusher.subscribe(`room-${roomId}`);
-   channel.bind('new-message', (msg) => setMessages([...messages, msg]));
- }, [roomId, messages]);
+ useEffect(() => {
+   const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
+     cluster: import.meta.env.VITE_PUSHER_CLUSTER,
+   });
+   const channel = pusher.subscribe(`room-${roomId}`);
+   channel.bind('new-message', (data) => {
+     dispatch({ type: 'APPEND_MESSAGE', payload: data });
+   });
+   return () => {
+     channel.unbind_all();
+     pusher.unsubscribe(`room-${roomId}`);
+     pusher.disconnect();
+   };
+ }, [roomId, dispatch]);