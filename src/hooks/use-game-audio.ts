import { useAudioPlayer } from "expo-audio";

import type { TomIndex } from "../engine/types";

const TOM_SOURCES: Record<TomIndex, number> = {
  1: require("../../assets/audio/tom-1.wav"),
  2: require("../../assets/audio/tom-2.wav"),
  3: require("../../assets/audio/tom-3.wav"),
  4: require("../../assets/audio/tom-4.wav"),
};

const CLICK_SOURCE = require("../../assets/audio/click.wav");

export type AudioPlayerHandle = ReturnType<typeof useAudioPlayer>;

export type GameAudio = {
  click: AudioPlayerHandle;
  toms: Record<TomIndex, AudioPlayerHandle>;
};

/** Loads the click track + all 4 tom hit sounds once for the life of the screen. */
export function useGameAudio(): GameAudio {
  const click = useAudioPlayer(CLICK_SOURCE);
  const tom1 = useAudioPlayer(TOM_SOURCES[1]);
  const tom2 = useAudioPlayer(TOM_SOURCES[2]);
  const tom3 = useAudioPlayer(TOM_SOURCES[3]);
  const tom4 = useAudioPlayer(TOM_SOURCES[4]);

  return { click, toms: { 1: tom1, 2: tom2, 3: tom3, 4: tom4 } };
}

/** Fire-and-forget replay from the start — SFX latency here is a feel concern, not a scoring one. */
export function playFromStart(player: AudioPlayerHandle): void {
  player.seekTo(0);
  player.play();
}
