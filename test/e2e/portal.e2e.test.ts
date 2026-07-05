import { unstable_dev, type Unstable_DevWorker } from "wrangler";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("portal e2e (wrangler dev)", () => {
  let worker: Unstable_DevWorker;

  beforeAll(async () => {
    worker = await unstable_dev("src/index.ts", {
      config: "wrangler.jsonc",
      local: true,
      logLevel: "error",
    });
  }, 120_000);

  afterAll(async () => {
    await worker.stop();
  });

  it("serves the home page with an app card", async () => {
    const response = await worker.fetch("http://localhost/");
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain("App Portal");
    expect(body).toContain("MAF 180 Calculator");
    expect(body).toContain('href="/apps/maffetone"');
  });

  it("serves the MAF calculator with form elements", async () => {
    const response = await worker.fetch("http://localhost/apps/maffetone");
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(body).toContain('id="age"');
    expect(body).toContain('name="modifier"');
    expect(body).toContain("MAF heart rate ceiling");
  });

  it("returns 404 for unknown routes", async () => {
    const response = await worker.fetch("http://localhost/does-not-exist");
    expect(response.status).toBe(404);
    const body = await response.text();
    expect(body).toContain("404");
  });
});
