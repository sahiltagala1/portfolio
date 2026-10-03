/**
 * A small, deterministic teaching model of one EV charging session.
 *
 * This is NOT the LSTM from the dissertation. It is a transparent stand-in
 * that keeps the one property the site wants visitors to feel: an anomaly
 * score that can be split, feature by feature, into the reasons behind it.
 * All data here is fictional.
 */

export const SESSION_MINUTES = 90;
export const RATED_KW = 7.4;
export const STEADY_KW = 7.2;
export const RAMP_END = 8;
export const TAPER_START = 62;
export const FLAG_THRESHOLD = 0;
export const MAX_RATIO = 8;

export type Reading = { minute: number; powerKw: number; tempC: number };

export type FeatureId = "powerGap" | "jump" | "overLimit" | "heat";

export type Contribution = {
  id: FeatureId;
  label: string;
  /** What was observed, written for a person. */
  observed: string;
  /** Signed push on the score. Above zero pushes toward a flag. */
  value: number;
};

export type Explanation = {
  minute: number;
  reading: Reading;
  contributions: Contribution[];
  score: number;
  flagged: boolean;
};

export type Phase = { id: string; name: string; from: number; to: number };

export const PHASES: Phase[] = [
  { id: "ramp", name: "Ramp", from: 0, to: RAMP_END },
  { id: "steady", name: "Steady state", from: RAMP_END, to: TAPER_START },
  { id: "taper", name: "Taper", from: TAPER_START, to: SESSION_MINUTES },
];

/** Power the charger should deliver at a given minute of a healthy session. */
export function expectedPower(minute: number): number {
  if (minute <= 0) return 0;
  if (minute < RAMP_END) return (STEADY_KW * minute) / RAMP_END;
  if (minute < TAPER_START) return STEADY_KW;
  return STEADY_KW * Math.exp(-(minute - TAPER_START) / 11);
}

/** Connector temperature a healthy session should show: ambient plus load. */
export function expectedTemp(minute: number): number {
  return 22 + 1.6 * expectedPower(minute);
}

/** Injected faults. Each one is meant to light up a different feature. */
const POWER_FAULTS: Record<number, number> = { 24: 8.6, 52: 2.9 };
const TEMP_FAULTS: Record<number, number> = { 39: 11, 40: 22, 41: 11 };

function wobble(minute: number): number {
  return Math.sin(minute * 1.7) * 0.1 + Math.sin(minute * 0.6) * 0.06;
}

export function buildSession(): Reading[] {
  const out: Reading[] = [];
  for (let minute = 0; minute <= SESSION_MINUTES; minute++) {
    const base = minute === 0 ? 0 : Math.max(0, expectedPower(minute) + wobble(minute));
    const powerKw = POWER_FAULTS[minute] ?? base;
    const tempC = expectedTemp(minute) + Math.sin(minute * 0.9) * 0.8 + (TEMP_FAULTS[minute] ?? 0);
    out.push({ minute, powerKw: round(powerKw, 2), tempC: round(tempC, 1) });
  }
  return out;
}

const TOLERANCE: Record<FeatureId, number> = { powerGap: 0.5, jump: 0.4, overLimit: 0.2, heat: 4 };

/**
 * A feature sitting inside its tolerance scores close to -1 (it argues
 * against a flag). The further it strays, the higher it climbs, capped so one
 * wild value cannot drown out the rest.
 */
export function push(deviation: number, tolerance: number): number {
  const ratio = Math.min(Math.abs(deviation) / tolerance, MAX_RATIO);
  return round(ratio - 1, 2);
}

export function explain(session: Reading[], minute: number): Explanation {
  if (!Number.isInteger(minute) || minute < 1 || minute >= session.length) {
    throw new RangeError(`No reading to explain at minute ${minute}`);
  }
  const now = session[minute];
  const before = session[minute - 1];

  const gap = now.powerKw - expectedPower(minute);
  const step = now.powerKw - before.powerKw;
  const expectedStep = expectedPower(minute) - expectedPower(minute - 1);
  const over = Math.max(0, now.powerKw - RATED_KW);
  const heat = now.tempC - expectedTemp(minute);

  const contributions: Contribution[] = [
    {
      id: "powerGap",
      label: "Power against the expected curve",
      observed: `${signed(gap, 1)} kW from expected`,
      value: push(gap, TOLERANCE.powerGap),
    },
    {
      id: "jump",
      label: "Change since the last minute",
      observed: `${signed(step, 1)} kW in one minute`,
      value: push(step - expectedStep, TOLERANCE.jump),
    },
    {
      id: "overLimit",
      label: "Power above the charger's rating",
      observed: over > 0 ? `${over.toFixed(1)} kW over ${RATED_KW} kW` : `within ${RATED_KW} kW`,
      value: push(over, TOLERANCE.overLimit),
    },
    {
      id: "heat",
      label: "Connector temperature",
      observed: `${signed(heat, 0)} °C from expected`,
      value: push(heat, TOLERANCE.heat),
    },
  ];

  const score = round(contributions.reduce((sum, c) => sum + c.value, 0), 2);
  return { minute, reading: now, contributions, score, flagged: score > FLAG_THRESHOLD };
}

export function flaggedMinutes(session: Reading[]): number[] {
  const out: number[] = [];
  for (let minute = 1; minute < session.length; minute++) {
    if (explain(session, minute).flagged) out.push(minute);
  }
  return out;
}

function round(n: number, places: number): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function signed(n: number, places: number): string {
  const text = Math.abs(n).toFixed(places);
  if (Number(text) === 0) return text;
  return (n < 0 ? "−" : "+") + text;
}
