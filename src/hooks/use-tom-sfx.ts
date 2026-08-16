import { useAudioPlayer } from "expo-audio";
import type { TomIndex } from "../engine/types";

const TOM_SOURCES: Record<TomIndex, number> = {
  1: require("../../assets/audio/tom-1.wav"),
  2: require("../../assets/audio/tom-2.wav"),
  3: require("../../assets/audio/tom-3.wav"),
  4: require("../../assets/audio/tom-4.wav"),
};

export type TomSfxPlayers = Record<TomIndex, ReturnType<typeof useAudioPlayer>>;

/** Owns only the four tom SFX players. It never controls the backing track. */
export function useTomSfx(): TomSfxPlayers {
  const tom1 = useAudioPlayer(TOM_SOURCES[1]);
  const tom2 = useAudioPlayer(TOM_SOURCES[2]);
  const tom3 = useAudioPlayer(TOM_SOURCES[3]);
  const tom4 = useAudioPlayer(TOM_SOURCES[4]);

  return { 1: tom1, 2: tom2, 3: tom3, 4: tom4 };
}

export async function playTomSfx(
  player: ReturnType<typeof useAudioPlayer>,
): Promise<void> {
  try {
    await player.seekTo(0);
    player.play();
  } catch (err) {
    if (__DEV__) console.warn("Tom SFX failed", err);
  }
}
