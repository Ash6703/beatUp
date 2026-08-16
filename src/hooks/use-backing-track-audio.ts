import { useAudioPlayer } from "expo-audio";

const BACKING_TRACK_SOURCE = require("../../assets/audio/click.wav");

export type BackingTrackPlayer = ReturnType<typeof useAudioPlayer>;

/** Owns only the backing-track player. Tom SFX never share this player. */
export function useBackingTrackAudio(): BackingTrackPlayer {
  return useAudioPlayer(BACKING_TRACK_SOURCE);
}
