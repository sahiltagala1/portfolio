/**
 * Teaching model of two ways to split session data into training and test
 * sets. The numbers are invented. The point is the one my dissertation ran
 * into: when the mix of garages changes over time, a split by date alone
 * tests the model on a different mix from the one it trained on.
 */

export const MONTHS = 12;
export const TRAIN_SHARE = 0.75;

export const GARAGES = [
  { id: "A", name: "Garage A", note: "winding down", perMonth: [40, 40, 38, 36, 34, 30, 26, 22, 18, 14, 10, 8] },
  { id: "B", name: "Garage B", note: "steady", perMonth: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20] },
  { id: "C", name: "Garage C", note: "opened in month 7", perMonth: [0, 0, 0, 0, 0, 0, 10, 20, 30, 40, 50, 60] },
] as const;

export type GarageId = (typeof GARAGES)[number]["id"];
export type Strategy = "chronological" | "stratified";
export type Cell = { train: number; test: number };
export type Mix = Record<GarageId, number>;

export type SplitResult = {
  strategy: Strategy;
  cells: Record<GarageId, Cell[]>;
  trainTotal: number;
  testTotal: number;
  /** Share of each garage inside the training set and the test set, 0 to 1. */
  trainMix: Mix;
  testMix: Mix;
  /** How different the two mixes are: 0 means identical, 1 means no overlap. */
  gap: number;
};

export function split(strategy: Strategy): SplitResult {
  if (strategy !== "chronological" && strategy !== "stratified") {
    throw new RangeError(`Unknown split strategy: ${String(strategy)}`);
  }
  const cells = {} as Record<GarageId, Cell[]>;
  const cutMonth = Math.round(MONTHS * TRAIN_SHARE);

  for (const g of GARAGES) {
    if (strategy === "chronological") {
      // One cut-off date for everyone.
      cells[g.id] = g.perMonth.map((n, m) => (m < cutMonth ? { train: n, test: 0 } : { train: 0, test: n }));
    } else {
      // Each garage keeps its own earliest 75% of sessions for training.
      let left = Math.round(sum(g.perMonth) * TRAIN_SHARE);
      cells[g.id] = g.perMonth.map((n) => {
        const train = Math.min(n, left);
        left -= train;
        return { train, test: n - train };
      });
    }
  }

  const trainBy = totals(cells, "train");
  const testBy = totals(cells, "test");
  const trainTotal = sum(Object.values(trainBy));
  const testTotal = sum(Object.values(testBy));
  const trainMix = shares(trainBy, trainTotal);
  const testMix = shares(testBy, testTotal);
  const gap = 0.5 * sum(GARAGES.map((g) => Math.abs(trainMix[g.id] - testMix[g.id])));

  return { strategy, cells, trainTotal, testTotal, trainMix, testMix, gap };
}

function totals(cells: Record<GarageId, Cell[]>, part: keyof Cell): Mix {
  const out = {} as Mix;
  for (const g of GARAGES) out[g.id] = sum(cells[g.id].map((c) => c[part]));
  return out;
}

function shares(by: Mix, total: number): Mix {
  const out = {} as Mix;
  for (const g of GARAGES) out[g.id] = total === 0 ? 0 : by[g.id] / total;
  return out;
}

function sum(ns: readonly number[]): number {
  return ns.reduce((a, b) => a + b, 0);
}
