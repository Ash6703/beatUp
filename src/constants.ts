export const RHYTHM_CONFIG = {
  bpm: 60,
  beatsPerBar: 4,
} as const;

export const BPM = RHYTHM_CONFIG.bpm;
export const BEATS_PER_BAR = RHYTHM_CONFIG.beatsPerBar;

/** How long the customer waits before reaching the end of the patience cycle. */
export const PATIENCE_WINDOW_MS = 18000;

/** Initial individual interval timing thresholds used by the rhythm judge. */
export const PERFECT_WINDOW_MS = 50;
export const GREAT_WINDOW_MS = 100;
export const GOOD_WINDOW_MS = 150;
