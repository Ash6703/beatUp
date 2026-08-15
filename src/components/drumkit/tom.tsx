import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import type { TomHitEvent, TomIndex } from "../../engine/types";
import { colors } from "../../theme";

type TomProps = {
  tom: TomIndex;
  /** 0-based position within the bar that's currently cued, driven by the beat clock. */
  beatInBarSV: SharedValue<number>;
  onHit: (hit: TomHitEvent) => void;
};

export function Tom({ tom, beatInBarSV, onHit }: TomProps) {
  const pressScale = useSharedValue(1);

  // Stable identity across renders so the worklet always calls the latest onHit
  // without needing to rebuild the gesture object every render.
  const handleHit = useCallback(
    (timestamp: number) => onHit({ tom, timestamp }),
    [tom, onHit],
  );

  const tap = Gesture.Tap().onBegin(() => {
    "worklet";
    const timestamp = performance.now();
    pressScale.value = withSequence(withTiming(1.18, { duration: 40 }), withTiming(1, { duration: 140 }));
    runOnJS(handleHit)(timestamp);
  });

  const animatedStyle = useAnimatedStyle(() => {
    const isCue = beatInBarSV.value === tom - 1;
    return {
      transform: [{ scale: pressScale.value }],
      backgroundColor: interpolateColor(isCue ? 1 : 0, [0, 1], [colors.tomHead, colors.tomHit]),
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.tom, animatedStyle]} />
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tom: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.tomShell,
  },
});
