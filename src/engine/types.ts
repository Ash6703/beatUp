export type TomIndex = 1 | 2 | 3 | 4;

export type Pattern = readonly [TomIndex, TomIndex, TomIndex, TomIndex];

export type OrderId = "A" | "B" | "C";

export type TomHitEvent = {
  tom: TomIndex;
  /** performance.now()-domain timestamp captured as close to the physical input as possible. */
  timestamp: number;
};

export type RhythmGrade = "perfect" | "great" | "good" | "miss";

export type RhythmIntervalResult = {
  actualMs: number;
  expectedMs: number;
  errorMs: number;
  grade: RhythmGrade;
};

export type RhythmResult = {
  /** One result for each gap between successive toms in the matched pattern. */
  intervals: readonly RhythmIntervalResult[];
  /** 0..100 measure of how evenly spaced the intervals were. */
  consistency: number;
  /** Average absolute interval error against the BPM-derived beat duration. */
  averageErrorMs: number;
  /** Overall interval grade; consistency is reported separately. */
  grade: RhythmGrade;
};

export type OrderItem = {
  readonly patternId: OrderId;
};

export type CustomerOrder = {
  readonly customerId: string;
  readonly items: readonly OrderItem[];
};
