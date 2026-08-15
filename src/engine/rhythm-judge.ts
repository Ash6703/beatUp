import {
  GOOD_WINDOW_MS,
  GREAT_WINDOW_MS,
  PERFECT_WINDOW_MS,
} from "../constants";
import type { RhythmGrade, RhythmIntervalResult, RhythmResult, TomHitEvent } from "./types";

export function beatDurationMs(bpm: number): number {
  if (!Number.isFinite(bpm) || bpm <= 0) {
    throw new Error(`BPM must be greater than 0. Received ${bpm}`);
  }
  return 60000 / bpm;
}

function gradeForError(errorMs: number): RhythmGrade {
  if (errorMs <= PERFECT_WINDOW_MS) return "perfect";
  if (errorMs <= GREAT_WINDOW_MS) return "great";
  if (errorMs <= GOOD_WINDOW_MS) return "good";
  return "miss";
}

/**
 * Judges only the relative spacing inside a matched pattern.
 *
 * The first tap has no absolute timing score. A constant input/device offset
 * therefore does not hurt rhythm consistency.
 */
export function judgeRhythm(hits: readonly TomHitEvent[], bpm: number): RhythmResult {
  if (hits.length < 2) {
    throw new Error("A rhythm pattern needs at least two hits.");
  }

  const expectedMs = beatDurationMs(bpm);
  const intervals: RhythmIntervalResult[] = [];

  for (let i = 1; i < hits.length; i += 1) {
    const actualMs = hits[i].timestamp - hits[i - 1].timestamp;
    const errorMs = Math.abs(actualMs - expectedMs);
    intervals.push({
      actualMs,
      expectedMs,
      errorMs,
      grade: gradeForError(errorMs),
    });
  }

  const averageErrorMs =
    intervals.reduce((sum, interval) => sum + interval.errorMs, 0) / intervals.length;

  // Consistency is based on how much the player's successive intervals vary
  // from one another. A steady +80ms input offset still produces 100% rhythm
  // consistency because the intervals themselves remain equal.
  const meanInterval =
    intervals.reduce((sum, interval) => sum + interval.actualMs, 0) / intervals.length;
  const meanAbsoluteDeviation =
    intervals.reduce((sum, interval) => sum + Math.abs(interval.actualMs - meanInterval), 0) /
    intervals.length;

  const consistency = Math.max(0, Math.min(100, 100 * (1 - meanAbsoluteDeviation / expectedMs)));

  const worstGrade = intervals.some((i) => i.grade === "miss")
    ? "miss"
    : intervals.some((i) => i.grade === "good")
      ? "good"
      : intervals.some((i) => i.grade === "great")
        ? "great"
        : "perfect";

  return {
    intervals,
    consistency,
    averageErrorMs,
    grade: worstGrade,
  };
}
