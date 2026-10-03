import { describe, expect, it } from "vitest";
import { GARAGES, TRAIN_SHARE, split, type Strategy } from "@/lib/split";

const all = GARAGES.reduce((n, g) => n + g.perMonth.reduce<number>((a, b) => a + b, 0), 0);

describe("split model", () => {
  it.each(["chronological", "stratified"] as const)("%s keeps every session exactly once", (s) => {
    const r = split(s);
    expect(r.trainTotal + r.testTotal).toBe(all);
    for (const g of GARAGES) {
      r.cells[g.id].forEach((c, m) => expect(c.train + c.test).toBe(g.perMonth[m]));
    }
  });

  it.each(["chronological", "stratified"] as const)("%s never tests on sessions older than training ones", (s) => {
    const r = split(s);
    for (const g of GARAGES) {
      const firstTest = r.cells[g.id].findIndex((c) => c.test > 0);
      const lastTrain = r.cells[g.id].findLastIndex((c) => c.train > 0);
      if (firstTest !== -1 && lastTrain !== -1) expect(firstTest).toBeGreaterThanOrEqual(lastTrain);
    }
  });

  it("a split by date alone tests on a very different mix of garages", () => {
    const r = split("chronological");
    expect(r.gap).toBeGreaterThan(0.4);
    expect(r.testMix.C).toBeGreaterThan(r.trainMix.C * 3);
  });

  it("a split by date within each garage keeps the mix the same", () => {
    const r = split("stratified");
    expect(r.gap).toBeLessThan(0.01);
    expect(r.trainTotal / all).toBeCloseTo(TRAIN_SHARE, 2);
  });

  it("mix shares add up to one", () => {
    for (const s of ["chronological", "stratified"] as const) {
      const r = split(s);
      expect(Object.values(r.trainMix).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
      expect(Object.values(r.testMix).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 9);
    }
  });

  it("is deterministic and rejects unknown strategies", () => {
    expect(split("stratified")).toEqual(split("stratified"));
    expect(() => split("random" as Strategy)).toThrow(RangeError);
  });
});
