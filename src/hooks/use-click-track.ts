import { useEffect, useRef } from "react";

import { beatPosition, type BeatClock } from "../engine/beat-clock";
import { playFromStart, type AudioPlayerHandle } from "./use-game-audio";

/**
 * Retriggers the click sound every time the computed beat grid crosses an
 * integer beat, instead of trusting a single long `loop: true` sample —
 * avoids drift accumulating at the loop boundary (see beatup.md).
 */
export function useClickTrack(clock: BeatClock, player: AudioPlayerHandle, enabled: boolean): void {
  const lastBeatRef = useRef(-1);

  useEffect(() => {
    if (!enabled) return;
    let frameId: number;

    const tick = () => {
      const beat = Math.floor(beatPosition(clock, performance.now()));
      if (beat > lastBeatRef.current) {
        lastBeatRef.current = beat;
        playFromStart(player);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [clock, player, enabled]);
}
