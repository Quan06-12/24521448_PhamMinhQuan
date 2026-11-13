# Lab 04 – Task Decomposition

## Setup
- [x] Create the Lab-04 folder structure and documentation.
- [ ] Commit: `chore(lab4): init lab 04 structure and rules`

## Exercise 1: Master-Detail Directory (Sprint 1)
- [ ] Scaffold Vite React app and install `react-router@7`.
- [ ] Wrap the app in `<BrowserRouter>`; declare nested `<Routes>` (Ex 1.3).
- [ ] Shared `Layout` with `NavLink` active callback and `<Outlet />` (Ex 1.3.1).
- [ ] `PeopleLayout` CSS Grid `minmax(200px, 1fr) 2fr`, responsive at 375px (Ex 1.3.2).
- [ ] `PersonDetail` with `useParams`, `people.find()` 404 guard and `<dl>` rendering (Ex 1.3.2).
- [ ] Lazy-load `PersonDetail` with a dimension-matched `<Suspense>` skeleton (Ex 1.2).
- [ ] Verify: deep link reload, `/people/999` 404, unknown URL page, 0 console warnings,
      separate chunk in Network tab, no `Switch` / `activeClassName` / `exact`.
- [ ] Commits: `feat: router layout`, `feat: detail route handling`, `feat: lazy detail with suspense`.

## Exercise 2: Context Form Engine (Sprint 2)
- [ ] Document the legacy 5-`useEffect` chain and its failure (Ex 1.6).
- [ ] `FormContext` provider + `useFormContext` hook.
- [ ] `SimpleForm` derives `errors` / `isValid` during render (zero `useEffect`).
- [ ] `InputField` with `useId`, `aria-invalid`, `aria-describedby`, `role="alert"` error.
- [ ] `ShowData` renders submitted values as a `<dl>` inspector.
- [ ] Commits: `feat: form context`, `feat: input field validation`, `feat: inspector output`.

## Exercise 3: Full-Stack Forum (Sprint 3)
- [ ] `server/`: Express + CORS (`localhost:5173`) + `express.json()`.
- [ ] `GET /api/messages/:forum` and `POST /api/messages/:forum` with payload validation
      and `crypto.randomUUID()`.
- [ ] `client/`: `useForumMessages(channelId)` with `AbortController` cleanup,
      loading / error state and POST helper (Ex 1.7.1).
- [ ] Channel switcher for `nasa`, `esports-tribunal`, `notNasa`.
- [ ] Verify on Slow 3G: rapid switching shows cancelled requests, no stale data.
- [ ] Save the full-stack error log verification.

## Homeworks
- [ ] Homework 1 – see `Homework-1/TASK_DECOMPOSITION.md`.
- [ ] Homework 2 – see `Homework-2/TASK_DECOMPOSITION.md`.
- [ ] Homework 3 – see `Homework-3/TASK_DECOMPOSITION.md`.
- [ ] Record at least 3 observed AI bugs in `AI_FAILURE_AUDIT.md`.