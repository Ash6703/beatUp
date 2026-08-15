import { useMemo } from "react";
import { useDerivedValue, useFrameCallback, useSharedValue, type SharedValue } from "react-native-reanimated";

import { beatPosition, createBeatClock, type BeatClock } from "../engine/beat-clock";

export type BeatClockHandle = {
  clock: BeatClock;
  /** Continuous beat position (e.g. 2.5), updated every frame on the UI thread. */
  beatPositionSV: SharedValue<number>;
  /** 0-based position within the current bar, derived from `beatPositionSV`. */
  beatInBarSV: SharedValue<number>;
};

/**
 * Anchors a beat grid to the moment this hook first runs, then advances a
 * shared value every frame purely from that anchor + elapsed time — never
 * from audio playback position (see beatup.md: "Platform & orientation").
 */
export function useBeatClock(bpm: number, beatsPerBar = 4): BeatClockHandle {
  const clock = useMemo(() => createBeatClock(bpm, performance.now(), beatsPerBar), [bpm, beatsPerBar]);

  const beatPositionSV = useSharedValue(0);
  const beatInBarSV = useDerivedValue(() => {
    const pos = beatPositionSV.value;
    const m = Math.floor(pos) % clock.beatsPerBar;
    return m < 0 ? m + clock.beatsPerBar : m;
  });

  useFrameCallback(() => {
    beatPositionSV.value = beatPosition(clock, performance.now());
  }, true);

  return { clock, beatPositionSV, beatInBarSV };
}
