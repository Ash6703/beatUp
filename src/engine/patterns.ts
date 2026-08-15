import type { OrderId, Pattern } from "./types";

// Stage 1 POC content — one bar of 4/4, quarter notes only.
// Tom index: 1 = bottom-left ... 4 = bottom-right.
export const ORDER_PATTERNS: Record<OrderId, Pattern> = {
  A: [1, 2, 3, 4],
  B: [4, 3, 2, 1],
  C: [2, 3, 2, 3],
};

export const ORDER_SEQUENCE: readonly OrderId[] = ["A", "B", "C"];
