import { beatInBar, beatTime, nearestBeatIndex, type BeatClock } from "./beat-clock";
import type { Pattern, TomHitEvent } from "./types";

export type JudgeResult =
  | { kind: "hit"; streak: number }
  | { kind: "complete" }
  | { kind: "wrong-tom" }
  | { kind: "outside-window" }
  | { kind: "already-judged" };

export const DEFAULT_HIT_WINDOW_MS = 125;

/**
 * Tracks progress through a 4-hit pattern as a rolling streak: every beat is
 * checked against `pattern[beatInBar]`, matching the Simon-Says visual cue.
 * A wrong tom or a missed window resets the streak to 0 (per spec, this is
 * not a fail state — the player just keeps trying against the looping
 * click track). `beatsPerBar` consecutive correct beats completes the order.
 */
export class PatternJudge {
  private streak = 0;
  private lastJudgedBeatIndex: number | null = null;

  constructor(
    private readonly pattern: Pattern,
    private readonly hitWindowMs: number = DEFAULT_HIT_WINDOW_MS,
  ) {}

  reset(): void {
    this.streak = 0;
    this.lastJudgedBeatIndex = null;
  }

  judge(clock: BeatClock, hit: TomHitEvent): JudgeResult {
    const beatIndex = nearestBeatIndex(clock, hit.timestamp);
    const expectedTime = beatTime(clock, beatIndex);

    if (Math.abs(hit.timestamp - expectedTime) > this.hitWindowMs) {
      return { kind: "outside-window" };
    }

    if (beatIndex === this.lastJudgedBeatIndex) {
      return { kind: "already-judged" };
    }
    this.lastJudgedBeatIndex = beatIndex;

    const expectedTom = this.pattern[beatInBar(clock, beatIndex)];
    if (hit.tom !== expectedTom) {
      this.streak = 0;
      return { kind: "wrong-tom" };
    }

    this.streak += 1;
    if (this.streak >= this.pattern.length) {
      this.streak = 0;
      return { kind: "complete" };
    }
    return { kind: "hit", streak: this.streak };
  }
}
