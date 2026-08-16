import { useEffect, useRef } from "react";

import type { BackingTrackPlayer } from "./use-backing-track-audio";

/** Starts and loops the complete backing-track file independently of Tom SFX. */
export function useClickTrack(player: BackingTrackPlayer, enabled: boolean): void {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || startedRef.current) return;

    startedRef.current = true;
    player.loop = true;

    void player.seekTo(0).then(() => player.play()).catch((err) => {
      if (__DEV__) console.warn("Backing track failed", err);
    });
  }, [enabled, player]);
}
