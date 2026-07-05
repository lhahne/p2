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
npm test             # vitest (if tests exist)
npm run deploy       # wrangler deploy
```

## Future ideas

- **KV per-app storage** — bind a KV namespace for lightweight persistence (notes, settings).
- **Cloudflare Access** — protect the portal or individual apps with basic auth / SSO.
- **API routes** — convention like `/apps/:slug/api/*` for JSON endpoints alongside HTML pages.
- **App metadata** — tags, icons, feature flags in the registry for richer portal home.
