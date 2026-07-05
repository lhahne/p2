/// <reference types="@cloudflare/vitest-pool-workers/types" />

import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("worker fetch handler", () => {
  it("GET / returns the portal home page", async () => {
    const response = await SELF.fetch("http://example.com/");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    const body = await response.text();
    expect(body).toContain("App Portal");
    expect(body).toContain('href="/apps/maffetone"');
  });

  it("GET /apps/maffetone returns the MAF calculator", async () => {
    const response = await SELF.fetch("http://example.com/apps/maffetone");
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain("MAF");
  });

  it("GET /apps/unknown returns 404", async () => {
    const response = await SELF.fetch("http://example.com/apps/unknown");
    expect(response.status).toBe(404);
    const body = await response.text();
    expect(body).toContain("404");
  });

  it("GET /nonexistent returns 404", async () => {
    const response = await SELF.fetch("http://example.com/nonexistent");
    expect(response.status).toBe(404);
    const body = await response.text();
    expect(body).toContain("404");
  });
});
