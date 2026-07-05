import { describe, expect, it } from "vitest";
import { getApp } from "./registry";

describe("getApp", () => {
  it("returns the app for a known slug", () => {
    const app = getApp("maffetone");
    expect(app).toBeDefined();
    expect(app?.slug).toBe("maffetone");
    expect(app?.name).toBe("MAF 180 Calculator");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getApp("unknown")).toBeUndefined();
    expect(getApp("")).toBeUndefined();
  });
});
