export type TomIndex = 1 | 2 | 3 | 4;

export type Pattern = readonly [TomIndex, TomIndex, TomIndex, TomIndex];

export type OrderId = "A" | "B" | "C";

export type TomHitEvent = {
  tom: TomIndex;
  /** performance.now()-domain timestamp captured as close to the physical input as possible. */
  timestamp: number;
};

export type RhythmGrade = "perfect" | "great" | "good" | "miss";

export type RhythmSession = {
  readonly bpm: number;
  /** Calculated once when the game session starts; reused for every input. */
  readonly beatDurationMs: number;
};

export type RhythmResult = {
  /** Each matched input measured from the first input of this pattern. */
  readonly inputs: readonly {
    timestamp: number;
    relativeMs: number;
    expectedMs: number;
    errorMs: number;
  }[];
  /** Sum of every cumulative timing error. The first input contributes zero. */
  readonly totalErrorMs: number;
  readonly grade: RhythmGrade;
};

export type OrderItem = {
  readonly patternId: OrderId;
};

export type CustomerOrder = {
  readonly customerId: string;
  readonly items: readonly OrderItem[];
};
