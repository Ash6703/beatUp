import { useEffect, useMemo, useState } from "react";
import { useDerivedValue, useFrameCallback, useSharedValue, type SharedValue } from "react-native-reanimated";

import { beatPosition, createBeatClock, type BeatClock } from "../engine/beat-clock";

export type BeatClockHandle = {
  clock: BeatClock;
  /** Continuous beat position (e.g. 2.5), updated every frame on the UI thread. Stays 0 until running. */
  beatPositionSV: SharedValue<number>;
  /** 0-based position within the current bar, derived from `beatPositionSV`. */
  beatInBarSV: SharedValue<number>;
};

/**
 * Anchors a beat grid to the moment `running` first becomes true (the Play
 * tap), not to mount time — the drumkit/café render immediately, but the
 * metronome/level don't start until then (beatup.md-adjacent: play-gate).
 * Once anchored, advances a shared value every frame purely from that
 * anchor + elapsed time — never from audio playback position.
 */
export function useBeatClock(bpm: number, running: boolean, beatsPerBar = 4): BeatClockHandle {
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (running && startTime === null) {
      setStartTime(performance.now());
    }
  }, [running, startTime]);

  const clock = useMemo(
    () => createBeatClock(bpm, startTime ?? 0, beatsPerBar),
    [bpm, startTime, beatsPerBar],
  );

  const beatPositionSV = useSharedValue(0);
  const beatInBarSV = useDerivedValue(() => {
    const pos = beatPositionSV.value;
    const m = Math.floor(pos) % clock.beatsPerBar;
    return m < 0 ? m + clock.beatsPerBar : m;
  });

  useFrameCallback(() => {
    if (startTime === null) return;
    beatPositionSV.value = beatPosition(clock, performance.now());
  }, true);

  return { clock, beatPositionSV, beatInBarSV };
}
