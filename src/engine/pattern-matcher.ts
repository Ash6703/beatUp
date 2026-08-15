import type { OrderId, Pattern, TomHitEvent } from "./types";

type PatternMap = Readonly<Record<OrderId, Pattern>>;

export type PatternMatch = {
  patternId: OrderId;
  hits: readonly TomHitEvent[];
};

/**
 * Streaming pattern matcher.
 *
 * Input is intentionally independent of the song clock. It keeps the most
 * recent contiguous taps that could still be the beginning of a pattern.
 * When a complete pattern is found, its exact tap timestamps are returned for
 * relative rhythm scoring.
 */
export class PatternMatcher {
  private readonly patterns: PatternMap;
  private buffer: TomHitEvent[] = [];

  constructor(patterns: PatternMap) {
    this.patterns = patterns;
  }

  reset(): void {
    this.buffer = [];
  }

  push(hit: TomHitEvent): PatternMatch | null {
    this.buffer.push(hit);

    const completed = this.findCompletedPattern();
    if (completed) {
      const match = completed;
      this.buffer = this.longestPrefixSuffix();
      return match;
    }

    this.buffer = this.longestPrefixSuffix();
    return null;
  }

  private findCompletedPattern(): PatternMatch | null {
    const matches = (Object.entries(this.patterns) as [OrderId, Pattern][]).filter(
      ([, pattern]) => this.buffer.length >= pattern.length && this.endsWith(pattern),
    );

    if (matches.length === 0) return null;

    matches.sort(([, a], [, b]) => b.length - a.length);
    const [patternId, pattern] = matches[0];
    return {
      patternId,
      hits: this.buffer.slice(this.buffer.length - pattern.length),
    };
  }

  private endsWith(pattern: Pattern): boolean {
    const start = this.buffer.length - pattern.length;
    return pattern.every((tom, index) => this.buffer[start + index]?.tom === tom);
  }

  /**
   * Keep the longest suffix that is also a prefix of at least one pattern.
   * This lets input such as 1,1,2,3,4 still recognize A from the second 1.
   */
  private longestPrefixSuffix(): TomHitEvent[] {
    let best: TomHitEvent[] = [];

    for (const pattern of Object.values(this.patterns)) {
      const maxLength = Math.min(pattern.length - 1, this.buffer.length);
      for (let length = maxLength; length > best.length; length -= 1) {
        const start = this.buffer.length - length;
        const isPrefix = pattern.every(
          (tom, index) => index >= length || this.buffer[start + index]?.tom === tom,
        );
        if (isPrefix) {
          best = this.buffer.slice(start);
          break;
        }
      }
    }

    return best;
  }
}
