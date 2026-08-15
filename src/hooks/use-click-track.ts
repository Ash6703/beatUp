import { useEffect, useRef } from "react";

import { playFromStart, type AudioPlayerHandle } from "./use-game-audio";

/**
 * Starts the click track exactly once and lets native looping carry it from
 * there, instead of JS re-triggering a short one-shot sample on every beat.
 * The old rAF-driven retrigger loop could land two seekTo/play calls on the
 * same native player close enough together to crash — a native-level race
 * that a JS try/catch can't protect against, since it isn't a JS error.
 *
 * This works because click.wav is baked to be exactly one beat long at the
 * level's BPM (see scripts/gen-placeholder-audio.js) — `player.loop = true`
 * alone reproduces the TICK-tick-tick-tick pattern with zero further JS
 * involvement.
 */
export function useClickTrack(player: AudioPlayerHandle, enabled: boolean): void {
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || startedRef.current) return;
    startedRef.current = true;
    player.loop = true;
    void playFromStart(player);
  }, [enabled, player]);
}
