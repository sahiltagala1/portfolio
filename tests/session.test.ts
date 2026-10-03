import { describe, expect, it } from "vitest";
import {
  FLAG_THRESHOLD, MAX_RATIO, RATED_KW, SESSION_MINUTES,
  buildSession, expectedPower, explain, flaggedMinutes, push,
} from "@/lib/session";

const session = buildSession();

describe("session model", () => {
  it("is deterministic", () => {
    expect(buildSession()).toEqual(session);
  });

  it("covers the whole session, one reading per minute", () => {
    expect(session).toHaveLength(SESSION_MINUTES + 1);
    session.forEach((r, i) => expect(r.minute).toBe(i));
  });

  it("flags exactly the injected faults and the recovery after the dip", () => {
    expect(flaggedMinutes(session)).toEqual([24, 40, 52, 53]);
  });

  it("does not flag low power during the taper", () => {
    const e = explain(session, 78);
    expect(e.reading.powerKw).toBeLessThan(3);
    expect(e.flagged).toBe(false);
  });

  it("contributions add up to the score", () => {
    for (let m = 1; m <= SESSION_MINUTES; m++) {
      const e = explain(session, m);
      const sum = e.contributions.reduce((s, c) => s + c.value, 0);
      expect(sum).toBeCloseTo(e.score, 6);
      expect(e.flagged).toBe(e.score > FLAG_THRESHOLD);
    }
  });

  it("names the right main reason for each fault", () => {
    const top = (m: number) =>
      [...explain(session, m).contributions].sort((a, b) => b.value - a.value)[0].id;
    expect(top(24)).toBe("overLimit");
    expect(top(40)).toBe("heat");
    expect(["powerGap", "jump"]).toContain(top(52));
    expect(explain(session, 24).reading.powerKw).toBeGreaterThan(RATED_KW);
  });

  it("keeps every push between -1 and the cap", () => {
    expect(push(0, 1)).toBe(-1);
    expect(push(1e9, 1)).toBe(MAX_RATIO - 1);
    expect(push(-3, 1)).toBe(push(3, 1));
  });

  it("rejects minutes it cannot explain", () => {
    for (const bad of [0, -1, SESSION_MINUTES + 1, 1.5, Number.NaN]) {
      expect(() => explain(session, bad)).toThrow(RangeError);
    }
  });

  it("expected power ramps, holds and tapers", () => {
    expect(expectedPower(0)).toBe(0);
    expect(expectedPower(4)).toBeLessThan(expectedPower(8));
    expect(expectedPower(30)).toBe(expectedPower(50));
    expect(expectedPower(80)).toBeLessThan(expectedPower(62));
  });
});
