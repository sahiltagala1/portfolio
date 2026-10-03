import { describe, expect, it } from "vitest";
import { WHITELISTS, authorize, type Whitelist } from "@/lib/roaming";

describe("roaming authorisation model", () => {
  it("ALWAYS never asks the provider, online or offline", () => {
    for (const reachable of [true, false]) {
      const o = authorize("ALWAYS", reachable);
      expect(o).toMatchObject({ allowed: true, askedProvider: false, decidedBy: "stored copy" });
    }
  });

  it("every other setting uses the live answer when the provider is reachable", () => {
    for (const w of ["ALLOWED", "ALLOWED_OFFLINE", "NEVER"] as const) {
      expect(authorize(w, true)).toMatchObject({ allowed: true, askedProvider: true, decidedBy: "live answer" });
    }
  });

  it("ALLOWED and ALLOWED_OFFLINE fall back to the stored copy when offline", () => {
    for (const w of ["ALLOWED", "ALLOWED_OFFLINE"] as const) {
      expect(authorize(w, false)).toMatchObject({ allowed: true, decidedBy: "stored copy" });
    }
  });

  it("NEVER refuses when the provider cannot be reached", () => {
    expect(authorize("NEVER", false)).toMatchObject({ allowed: false, decidedBy: "nobody" });
  });

  it("only one of the eight cases is refused, and every trace ends with the verdict", () => {
    const outcomes = WHITELISTS.flatMap((w) => [authorize(w, true), authorize(w, false)]);
    expect(outcomes.filter((o) => !o.allowed)).toHaveLength(1);
    for (const o of outcomes) {
      expect(o.steps.at(-1)).toBe(o.allowed ? "Charging starts." : "Charging is refused.");
    }
  });

  it("is deterministic and rejects unknown settings", () => {
    expect(authorize("NEVER", false)).toEqual(authorize("NEVER", false));
    expect(() => authorize("SOMETIMES" as Whitelist, true)).toThrow(RangeError);
  });
});
