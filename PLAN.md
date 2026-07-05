# App Portal — Plan & Architecture

## Goals

- Single Cloudflare Worker that hosts a small "portal" of prototype mini-apps.
- Add a new app by creating one TypeScript module and registering it — no separate repos or deploys.
- Server-rendered HTML with optional inline client scripts for interactivity.

## Architecture

```
Request → src/index.ts (router)
            ├── GET /              → portal home (app cards)
            ├── GET /apps/:slug    → app.render(request)
            └── *                  → 404 HTML page
```

- **`PortalApp`** interface (`src/portal/registry.ts`): `slug`, `name`, `description`, `render(req)`.
- **`src/portal/registry.ts`**: central array of registered apps.
- **`src/portal/layout.ts`**: shared HTML shell, stylesheet, `escapeHtml`.
- **`src/apps/<name>.ts`**: each mini-app exports a `PortalApp` object.

Errors are caught in the fetch handler and returned as a structured 500 page (no `passThroughOnException`).

## How to add a new app

1. Create `src/apps/my-app.ts` exporting a `PortalApp`:

   ```ts
   import type { PortalApp } from "../portal/registry";
   import { layout } from "../portal/layout";

   export const myApp: PortalApp = {
     slug: "my-app",
     name: "My App",
     description: "What it does.",
     render(_req) {
       return new Response(layout("My App", "<h1>Hello</h1>"), {
         headers: { "Content-Type": "text/html; charset=utf-8" },
       });
     },
   };
   ```

2. Import and append it to the `apps` array in `src/portal/registry.ts`.
3. Run `npm run check` and `npm run dev` to verify at `/apps/my-app`.

## Local development & deploy

```bash
npm install
npm run dev          # wrangler dev (default port 8787)
npm run check        # tsc --noEmit
npm test             # unit + integration (fast layers)
npm run test:all     # unit + integration + e2e
npm run test:unit    # pure logic/layout/registry tests
npm run test:integration  # Worker handler in Miniflare via vitest-pool-workers
npm run test:e2e     # real wrangler dev HTTP smoke tests
npm run deploy       # wrangler deploy
```

### Deploy notes

- Worker name must be `p2` (matches the domain).
- Custom domain `p2.hahne.fi` is configured in `wrangler.jsonc`; the first deploy creates the DNS record automatically if the `hahne.fi` zone is in the same Cloudflare account.
- Deploy command: `npm run deploy` (requires `wrangler login` or a `CLOUDFLARE_API_TOKEN` env var).
- Cloudflare MCP can inspect workers and builds but cannot deploy; deployment uses the wrangler CLI or Workers Builds CI.

## Testing

The project uses a **test pyramid**: many fast unit tests at the base, fewer integration tests in the middle, and a small number of end-to-end smoke tests at the top.

| Layer | What it covers | Command |
| --- | --- | --- |
| **Unit** | Pure functions — MAF formula (modifiers, youth/senior cutoffs, zone bounds), `escapeHtml`, registry `getApp` | `npm run test:unit` |
| **Integration** | Default `fetch` handler routed through Miniflare (`@cloudflare/vitest-pool-workers`) — home page, app routes, 404s | `npm run test:integration` |
| **E2E** | Real `wrangler dev` server — HTTP responses for home, MAF app form, and unknown routes | `npm run test:e2e` |

- `npm test` runs unit + integration (the fast layers used in day-to-day development).
- `npm run test:all` adds e2e on top.

**Guidance:** add many unit tests for business logic, some integration tests for routing and HTML responses, and only a few e2e tests for full-stack confidence.

## Future ideas

- **KV per-app storage** — bind a KV namespace for lightweight persistence (notes, settings).
- **Cloudflare Access** — protect the portal or individual apps with basic auth / SSO.
- **API routes** — convention like `/apps/:slug/api/*` for JSON endpoints alongside HTML pages.
- **App metadata** — tags, icons, feature flags in the registry for richer portal home.
