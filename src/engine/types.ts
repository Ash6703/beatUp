export type TomIndex = 1 | 2 | 3 | 4;

export type Pattern = readonly [TomIndex, TomIndex, TomIndex, TomIndex];

export type OrderId = "A" | "B" | "C";

export type TomHitEvent = {
  tom: TomIndex;
  /** performance.now()-domain timestamp, captured as close to the physical touch/key event as possible. */
  timestamp: number;
};
