import { useEffect } from "react";
import { useFrameCallback, useSharedValue, type SharedValue } from "react-native-reanimated";

/**
 * 0..1 progress through the patience window since `orderStartTime`, clamped
 * at 1 (holds at red — see beatup.md, there's no fail state for this POC).
 */
export function usePatienceProgress(orderStartTime: number, windowMs: number): SharedValue<number> {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
  }, [orderStartTime, progress]);

  useFrameCallback(() => {
    const elapsed = performance.now() - orderStartTime;
    progress.value = Math.min(1, elapsed / windowMs);
  }, true);

  return progress;
}
