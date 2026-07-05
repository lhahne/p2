export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STYLES = `
:root {
  color-scheme: light dark;
  --bg: #f4f4f5;
  --surface: #ffffff;
  --text: #18181b;
  --muted: #71717a;
  --border: #e4e4e7;
  --accent: #2563eb;
  --accent-hover: #1d4ed8;
  --danger: #dc2626;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
  --radius: 12px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #09090b;
    --surface: #18181b;
    --text: #fafafa;
    --muted: #a1a1aa;
    --border: #3f3f46;
    --accent: #3b82f6;
    --accent-hover: #60a5fa;
    --danger: #f87171;
    --shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.25);
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

.site-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.site-header a {
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
}

.site-header a:hover {
  text-decoration: underline;
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

h2 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
}

p {
  margin: 0 0 1rem;
}

.muted {
  color: var(--muted);
  font-size: 0.95rem;
}

.card-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  box-shadow: var(--shadow);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.15s, transform 0.15s;
}

.card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
  text-decoration: none;
}

.card h2 {
  margin: 0 0 0.35rem;
  font-size: 1.1rem;
}

.card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
}

input[type="number"] {
  width: 100%;
  max-width: 8rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 1rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.radio-option {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  cursor: pointer;
}

.radio-option:has(input:checked) {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, var(--surface));
}

.radio-option input {
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.radio-option span {
  font-size: 0.9rem;
}

.result-box {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.result-box .value {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0.25rem 0;
}

.result-box .zone {
  font-size: 1.1rem;
  font-weight: 500;
}

.notes {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--accent);
  background: color-mix(in srgb, var(--accent) 6%, var(--surface));
  font-size: 0.875rem;
  color: var(--muted);
}

.notes p {
  margin: 0 0 0.5rem;
}

.notes p:last-child {
  margin-bottom: 0;
}

.error-page {
  text-align: center;
  padding: 3rem 1rem;
}

.error-page h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.disclaimer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--muted);
}
`;

export function layout(title: string, bodyHtml: string): string {
  const safeTitle = escapeHtml(title);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} · App Portal</title>
  <style>${STYLES}</style>
</head>
<body>
  <div class="container">
    <header class="site-header">
      <a href="/">← App Portal</a>
    </header>
    ${bodyHtml}
  </div>
</body>
</html>`;
}
