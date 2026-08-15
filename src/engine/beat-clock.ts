/**
 * The backing track is a fixed-tempo click, not charted audio, so the beat
 * grid is computed from a single anchor timestamp rather than read off
 * playback position. Every beat time is `startTime + n * beatDurationMs`.
 */
export type BeatClock = {
  readonly startTime: number;
  readonly bpm: number;
  readonly beatDurationMs: number;
  readonly beatsPerBar: number;
};

export function createBeatClock(bpm: number, startTime: number, beatsPerBar = 4): BeatClock {
  return {
    startTime,
    bpm,
    beatDurationMs: (60 / bpm) * 1000,
    beatsPerBar,
  };
}

/** Absolute time (same domain as `startTime`) at which beat `n` occurs. */
export function beatTime(clock: BeatClock, n: number): number {
  return clock.startTime + n * clock.beatDurationMs;
}

/** Continuous beat position at time `now`, e.g. 2.5 = halfway between beat 2 and 3. */
export function beatPosition(clock: BeatClock, now: number): number {
  return (now - clock.startTime) / clock.beatDurationMs;
}

/** Index of the beat nearest to `now`. */
export function nearestBeatIndex(clock: BeatClock, now: number): number {
  return Math.round(beatPosition(clock, now));
}

/** 0-based position within the current bar for a given beat index. */
export function beatInBar(clock: BeatClock, n: number): number {
  const m = n % clock.beatsPerBar;
  return m < 0 ? m + clock.beatsPerBar : m;
}
