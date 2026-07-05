import { describe, expect, it } from "vitest";
import { computeMaf } from "./logic";

describe("computeMaf", () => {
  describe("youth cutoff", () => {
    it("uses fixed 165 ceiling at age 16", () => {
      const result = computeMaf(16, 0);
      expect(result.ceiling).toBe(165);
      expect(result.zoneLow).toBe(155);
      expect(result.zoneHigh).toBe(165);
      expect(result.note).toContain("16 and under");
    });

    it("uses the adult formula at age 17", () => {
      const result = computeMaf(17, 0);
      expect(result.ceiling).toBe(163);
      expect(result.zoneLow).toBe(153);
      expect(result.zoneHigh).toBe(163);
      expect(result.note).toBeNull();
    });

    it("ignores modifier for youth ages", () => {
      expect(computeMaf(12, -10).ceiling).toBe(165);
      expect(computeMaf(12, 5).ceiling).toBe(165);
    });
  });

  describe("modifiers", () => {
    const age = 40;

    it("applies −10 modifier", () => {
      expect(computeMaf(age, -10).ceiling).toBe(130);
    });

    it("applies −5 modifier", () => {
      expect(computeMaf(age, -5).ceiling).toBe(135);
    });

    it("applies 0 modifier", () => {
      expect(computeMaf(age, 0).ceiling).toBe(140);
    });

    it("applies +5 modifier", () => {
      expect(computeMaf(age, 5).ceiling).toBe(145);
    });
  });

  describe("senior note", () => {
    it("does not add a senior note at age 64", () => {
      const result = computeMaf(64, 0);
      expect(result.ceiling).toBe(116);
      expect(result.note).toBeNull();
    });

    it("adds a senior note at age 65", () => {
      const result = computeMaf(65, 0);
      expect(result.ceiling).toBe(115);
      expect(result.note).toContain("65");
    });
  });

  describe("zone bounds", () => {
    it("sets zoneLow to ceiling − 10 and zoneHigh to ceiling for adults", () => {
      const result = computeMaf(50, 0);
      expect(result.zoneLow).toBe(result.ceiling - 10);
      expect(result.zoneHigh).toBe(result.ceiling);
    });

    it("sets zone bounds for youth ceiling", () => {
      const result = computeMaf(10, 0);
      expect(result.zoneLow).toBe(155);
      expect(result.zoneHigh).toBe(165);
    });
  });
});
