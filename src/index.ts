import { apps, getApp } from "./portal/registry";
import { escapeHtml, layout } from "./portal/layout";

function renderHome(): Response {
  const cards = apps
    .map(
      (app) => `
    <a class="card" href="/apps/${escapeHtml(app.slug)}">
      <h2>${escapeHtml(app.name)}</h2>
      <p>${escapeHtml(app.description)}</p>
    </a>`,
    )
    .join("\n");

  const body = `
    <h1>App Portal</h1>
    <p class="muted">Prototype mini-apps from a single Worker — pick one to get started.</p>
    <div class="card-grid">
      ${cards || "<p class='muted'>No apps registered yet.</p>"}
    </div>
  `;

  return new Response(layout("Home", body), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function render404(pathname: string): Response {
  const body = `
    <div class="error-page">
      <h1>404</h1>
      <p class="muted">No page at <code>${escapeHtml(pathname)}</code></p>
      <p><a href="/">Back to portal home</a></p>
    </div>
  `;
  return new Response(layout("Not Found", body), {
    status: 404,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function render500(error: unknown): Response {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  const body = `
    <div class="error-page">
      <h1>500</h1>
      <p class="muted">Something went wrong while handling your request.</p>
      <p><code>${escapeHtml(message)}</code></p>
      <p><a href="/">Back to portal home</a></p>
    </div>
  `;
  return new Response(layout("Server Error", body), {
    status: 500,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function route(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === "/") {
    return renderHome();
  }

  const appMatch = pathname.match(/^\/apps\/([^/]+)\/?$/);
  if (appMatch) {
    const slug = appMatch[1];
    const app = getApp(slug);
    if (!app) {
      return render404(pathname);
    }
    return app.render(request);
  }

  return render404(pathname);
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      return await route(request);
    } catch (error) {
      return render500(error);
    }
  },
};
