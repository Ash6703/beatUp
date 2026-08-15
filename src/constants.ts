export const BPM = 80;
export const BEATS_PER_BAR = 4;

/** ±window around each expected beat time that still counts as a hit. Forgiving on purpose for the POC. */
export const HIT_WINDOW_MS = 125;

/** How long the customer takes to walk to the table / walk out, in ms. */
export const WALK_DURATION_MS = 1200;

/** How long the success reaction holds before advancing to the next order, in ms. */
export const SUCCESS_HOLD_MS = 900;

/** Full green -> yellow -> red patience cycle per order, in ms. Balance-only, not locked. */
export const PATIENCE_WINDOW_MS = 18000;
