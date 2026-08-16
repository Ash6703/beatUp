import type { RhythmSession } from "./types";

/**
 * Creates the immutable rhythm configuration for one game session.
 * beatDurationMs is calculated once here and reused by every pattern judge.
 */
export function createRhythmSession(bpm: number): RhythmSession {
  if (bpm <= 0) {
    throw new Error(`BPM must be positive. Received ${bpm}.`);
  }

  return {
    bpm,
    beatDurationMs: 60000 / bpm,
  };
}
