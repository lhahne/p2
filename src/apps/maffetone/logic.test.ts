import { describe, expect, it } from "vitest";
import { computeMaf } from "./logic";

describe("computeMaf", () => {
  it("uses fixed 165 ceiling for age 16 and under", () => {
    const result = computeMaf(16, 0);
    expect(result.ceiling).toBe(165);
    expect(result.zoneLow).toBe(155);
    expect(result.zoneHigh).toBe(165);
    expect(result.note).toContain("16 and under");
  });

  it("uses fixed 165 ceiling for young athletes regardless of modifier", () => {
    const result = computeMaf(12, 5);
    expect(result.ceiling).toBe(165);
  });

  it("applies the 180 − age + modifier formula for adults", () => {
    const result = computeMaf(40, 0);
    expect(result.ceiling).toBe(140);
    expect(result.zoneLow).toBe(130);
    expect(result.zoneHigh).toBe(140);
    expect(result.note).toBeNull();
  });

  it("applies negative and positive modifiers", () => {
    expect(computeMaf(40, -10).ceiling).toBe(130);
    expect(computeMaf(40, 5).ceiling).toBe(145);
  });

  it("adds senior note for age 65 and over", () => {
    const result = computeMaf(65, 0);
    expect(result.ceiling).toBe(115);
    expect(result.note).toContain("65");
  });
});
