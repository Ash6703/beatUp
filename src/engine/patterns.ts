import type { CustomerOrder, OrderId, Pattern } from "./types";

// Stage 1 POC content — one bar of 4/4, quarter-note patterns.
// BPM is deliberately separate from these patterns: the matcher only
// recognizes tom sequences; the rhythm judge uses the level BPM to score
// the intervals between the taps.
export const ORDER_PATTERNS: Record<OrderId, Pattern> = {
  A: [1, 2, 3, 4],
  B: [4, 3, 2, 1],
  C: [2, 3, 2, 3],
};

export const DEMO_ORDERS: readonly CustomerOrder[] = [
  { customerId: "X", items: [{ patternId: "A" }, { patternId: "B" }] },
  { customerId: "Y", items: [{ patternId: "C" }] },
  { customerId: "Z", items: [{ patternId: "C" }, { patternId: "A" }] },
];
