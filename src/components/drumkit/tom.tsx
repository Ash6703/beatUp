import React, { useCallback } from "react";
import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  runOnJS,
  withTiming,
} from "react-native-reanimated";

import type { TomHitEvent, TomIndex } from "../../engine/types";
import { colors, radii } from "../../theme";

type TomProps = {
  tom: TomIndex;
  onHit: (hit: TomHitEvent) => void;
};

export function Tom({ tom, onHit }: TomProps) {
  const pressScale = useSharedValue(1);

  const handleHit = useCallback(
    (timestamp: number) => onHit({ tom, timestamp }),
    [tom, onHit],
  );

  const tap = Gesture.Tap().onBegin(() => {
    "worklet";
    const timestamp = performance.now();
    pressScale.value = withSequence(
      withTiming(0.9, { duration: 40 }),
      withTiming(1, { duration: 120 }),
    );
    // This is only input capture; timing is judged later from successive taps.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // @ts-ignore React Native Gesture Handler worklet bridge
    runOnJS(handleHit)(timestamp);
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.tom, animatedStyle]}>
        <Text style={styles.number}>{tom}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tom: {
    width: 62,
    height: 62,
    borderRadius: radii.pill,
    borderWidth: 4,
    borderColor: colors.tomShell,
    backgroundColor: colors.tomHead,
    alignItems: "center",
    justifyContent: "center",
  },
  number: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.textDark,
  },
});
