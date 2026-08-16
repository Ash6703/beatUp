import {
  GOOD_WINDOW_MS,
  GREAT_WINDOW_MS,
  PERFECT_WINDOW_MS,
} from "../constants";
import type { RhythmGrade, RhythmResult, RhythmSession, TomHitEvent } from "./types";

function gradeForTotalError(totalErrorMs: number, gapCount: number): RhythmGrade {
  // The old ±50/±100/±150 windows were per beat gap. Because the new score
  // sums cumulative errors, scale those benchmarks by the number of gaps.
  const perfectMax = PERFECT_WINDOW_MS * gapCount;
  const greatMax = GREAT_WINDOW_MS * gapCount;
  const goodMax = GOOD_WINDOW_MS * gapCount;

  if (totalErrorMs <= perfectMax) return "perfect";
  if (totalErrorMs <= greatMax) return "great";
  if (totalErrorMs <= goodMax) return "good";
  return "miss";
}

/**
 * Judges a matched pattern against a BPM-defined timeline anchored to the
 * player's first input. The backing-track playback position is never used.
 */
export function judgeRhythm(
  hits: readonly TomHitEvent[],
  session: RhythmSession,
): RhythmResult {
  if (hits.length < 2) {
    throw new Error("A rhythm pattern needs at least two hits.");
  }

  const startTime = hits[0].timestamp;
  const inputs = hits.map((hit, index) => {
    const relativeMs = hit.timestamp - startTime;
    const expectedMs = index * session.beatDurationMs;
    const errorMs = Math.abs(relativeMs - expectedMs);

    return {
      timestamp: hit.timestamp,
      relativeMs,
      expectedMs,
      errorMs,
    };
  });

  const totalErrorMs = inputs.reduce((sum, input) => sum + input.errorMs, 0);

  return {
    inputs,
    totalErrorMs,
    grade: gradeForTotalError(totalErrorMs, hits.length - 1),
  };
}
