## frontend@frontend

Modern TanStack Start frontend that talks directly to the Express backend that lives in `apps/backend`. The UI is intentionally minimal: it proves our wiring is correct by pulling `/api` metadata and `/api/users` from the backend and surfacing the results in the home route.

---

### Tech Stack

- React 19 + Vite 7
- TanStack Router (file-based) & TanStack Query
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Type-safe runtime env parsing with `@t3-oss/env-core`

---

### Getting Started

All commands are executed from the repository root.

```bash
# install monorepo deps
pnpm install

# start the frontend dev server (http://localhost:5173)
pnpm --filter frontend dev
```

Additional scripts:

| Command | Description |
| --- | --- |
| `pnpm --filter frontend build` | Production build |
| `pnpm --filter frontend serve` | Preview built assets |
| `pnpm --filter frontend lint` | ESLint using `@tanstack/eslint-config` |
| `pnpm --filter frontend test` | Vitest (jsdom) suite |

---

### Environment Variables

The frontend reads public variables through `src/env.ts`. Only `VITE_` prefixed keys are exposed to the browser. Current variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_APP_TITLE` | `Pioneers Frontend` | Optional override for the document title |
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Base URL for backend API calls |

Create `apps/frontend/.env` (or `.env.local`) to override defaults:

```env
VITE_API_BASE_URL=https://staging.api.yourdomain.com/api
```

---

### Backend Integration

Shared helpers live in `src/lib/api-client.ts`. They:

- Normalize the configured backend base URL
- Expose strongly typed helpers (`fetchApiInfo`, `fetchUsers`, `createAgent`)
- Throw descriptive errors when the backend is unreachable

`src/routes/index.tsx` demonstrates how to consume those helpers with TanStack Query, showing connection status, advertised endpoints, the sample `/api/users` payload, and the ElevenLabs agent workflow.

---

### ElevenLabs Agent Creator

- `src/components/AgentCreator.tsx` renders a full form on the home route that calls `POST /api/agents` via the backend.
- Users can configure the agent name, system prompt, first message, language, ElevenLabs TTS model, and must explicitly choose one of the curated female/male voice IDs for that language.
- Successful requests are persisted locally and rendered as cards (language, voice ID, model, and first message) so you can copy/paste IDs as needed.
- Supported languages/models/voices are shared with the backend through `src/lib/agent-options.ts` to keep the UI and API contracts aligned; changing the catalog in one place keeps the entire stack consistent.

---

### Project Structure

```
src/
├── components/        # Presentational components
├── lib/               # API client + other shared utilities
├── routes/            # File-based TanStack Router routes
├── router.tsx         # Router factory + providers
└── styles.css         # Tailwind v4 entry point
```

---

### Styling & UI

- Tailwind v4 utilities plus a thin layer of custom classes in `src/styles.css`
- Layout chrome is centralized in `src/routes/__root.tsx` and `src/components/Header.tsx`

---

### Linting & Formatting

- ESLint via `@tanstack/eslint-config`
- Prettier (see `prettier.config.js`)
- Run `pnpm --filter frontend lint` or `pnpm --filter frontend check` before opening a PR

---

### Testing

Vitest + Testing Library scaffolding is configured, even though the UI currently has no dedicated tests. Add specs under `src/**/*.test.ts(x)` and run `pnpm --filter frontend test`.

---

### Next Steps

- Build additional routes under `src/routes`
- Extend `src/lib/api-client.ts` with new backend endpoints
- Add UI state/tests as new features ship
