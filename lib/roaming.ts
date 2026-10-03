/**
 * Teaching model of token authorisation in EV roaming, after the whitelist
 * types in the OCPI protocol. A driver with a card from one company (the
 * provider) wants to charge at a station run by another (the operator).
 * The provider tells the operator in advance how far its card may be trusted
 * without asking. Simplified: when the provider can be reached, it says yes.
 */

export const WHITELISTS = ["ALWAYS", "ALLOWED", "ALLOWED_OFFLINE", "NEVER"] as const;
export type Whitelist = (typeof WHITELISTS)[number];

export const WHITELIST_MEANING: Record<Whitelist, string> = {
  ALWAYS: "Trust the stored copy of the card. Never ask.",
  ALLOWED: "Either is fine. The operator may ask or use its stored copy.",
  ALLOWED_OFFLINE: "Ask first. Use the stored copy only if the provider cannot be reached.",
  NEVER: "Always ask. A stored copy is not enough.",
};

export type Decider = "stored copy" | "live answer" | "nobody";

export type Outcome = {
  whitelist: Whitelist;
  providerReachable: boolean;
  allowed: boolean;
  decidedBy: Decider;
  askedProvider: boolean;
  steps: string[];
};

export function authorize(whitelist: Whitelist, providerReachable: boolean): Outcome {
  if (!WHITELISTS.includes(whitelist)) throw new RangeError(`Unknown whitelist type: ${String(whitelist)}`);

  const steps = ["Driver taps the card at the charger.", `Operator looks the card up. Its whitelist setting is ${whitelist}.`];
  const base = { whitelist, providerReachable };

  if (whitelist === "ALWAYS") {
    steps.push("Operator does not contact the provider.", "Operator accepts the stored copy of the card.", "Charging starts.");
    return { ...base, allowed: true, decidedBy: "stored copy", askedProvider: false, steps };
  }

  steps.push("Operator asks the provider to authorise the card.");
  if (providerReachable) {
    steps.push("Provider answers: allowed.", "Charging starts.");
    return { ...base, allowed: true, decidedBy: "live answer", askedProvider: true, steps };
  }

  steps.push("No answer. The provider cannot be reached.");
  if (whitelist === "NEVER") {
    steps.push("The setting forbids using the stored copy.", "Charging is refused.");
    return { ...base, allowed: false, decidedBy: "nobody", askedProvider: true, steps };
  }
  steps.push("The setting permits the stored copy as a fallback.", "Charging starts.");
  return { ...base, allowed: true, decidedBy: "stored copy", askedProvider: true, steps };
}
