import React, { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  runOnJS,
  withTiming,
} from "react-native-reanimated";

import type { TomHitEvent, TomIndex } from "../../engine/types";
import { radii } from "../../theme";

type ArcadeButtonProps = {
  tom: TomIndex;
  onHit: (hit: TomHitEvent) => void;
};

// Distinct, vibrant arcade color palettes for the 4 toms
const TOM_THEMES: Record<
  TomIndex,
  {
    capBg: string;
    capBorder: string;
    bezelBg: string;
    textColor: string;
    highlight: string;
  }
> = {
  1: {
    capBg: "#F4A261", // Warm terracotta / orange
    capBorder: "#C86A28",
    bezelBg: "#5A2A0C",
    textColor: "#3A1B07",
    highlight: "rgba(255, 255, 255, 0.45)",
  },
  2: {
    capBg: "#E76F51", // Coral / flame red
    capBorder: "#B84024",
    bezelBg: "#521A0E",
    textColor: "#380E06",
    highlight: "rgba(255, 255, 255, 0.45)",
  },
  3: {
    capBg: "#2A9D8F", // Teal / arcade mint
    capBorder: "#1B6D63",
    bezelBg: "#0C3631",
    textColor: "#082421",
    highlight: "rgba(255, 255, 255, 0.45)",
  },
  4: {
    capBg: "#E9C46A", // Golden sun / arcade yellow
    capBorder: "#C09530",
    bezelBg: "#523C0A",
    textColor: "#3D2B05",
    highlight: "rgba(255, 255, 255, 0.55)",
  },
};

export function ArcadeButton({ tom, onHit }: ArcadeButtonProps) {
  const pressDown = useSharedValue(0);
  const pressScale = useSharedValue(1);

  const theme = TOM_THEMES[tom];

  const handleHit = useCallback(
    (timestamp: number) => onHit({ tom, timestamp }),
    [tom, onHit],
  );

  const tap = Gesture.Tap().onBegin(() => {
    "worklet";
    const timestamp = performance.now();
    pressDown.value = withSequence(
      withTiming(4, { duration: 35 }),
      withTiming(0, { duration: 100 }),
    );
    pressScale.value = withSequence(
      withTiming(0.95, { duration: 35 }),
      withTiming(1, { duration: 100 }),
    );

    // Timing judgment is calculated later from input sequences
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // @ts-ignore
    runOnJS(handleHit)(timestamp);
  });

  const animatedCapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: pressDown.value },
      { scale: pressScale.value },
    ],
  }));

  return (
    <GestureDetector gesture={tap}>
      <View style={[styles.arcadeHousing, { backgroundColor: theme.bezelBg }]}>
        {/* Outer 3D Bevel Base */}
        <View style={styles.bezelRing}>
          {/* Animated Depressable Plunger / Cap */}
          <Animated.View
            style={[
              styles.plungerCap,
              {
                backgroundColor: theme.capBg,
                borderColor: theme.capBorder,
              },
              animatedCapStyle,
            ]}
          >
            {/* Top Gloss Arc Highlight */}
            <View
              style={[
                styles.glossHighlight,
                { backgroundColor: theme.highlight },
              ]}
            />
            {/* Number Label */}
            <Text style={[styles.label, { color: theme.textColor }]}>{tom}</Text>
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  arcadeHousing: {
    width: 74,
    height: 74,
    borderRadius: radii.pill,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#22120A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 6,
  },
  bezelRing: {
    width: "100%",
    height: "100%",
    borderRadius: radii.pill,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  plungerCap: {
    width: 60,
    height: 60,
    borderRadius: radii.pill,
    borderWidth: 3.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  glossHighlight: {
    position: "absolute",
    top: 4,
    left: 10,
    right: 10,
    height: 12,
    borderRadius: radii.pill,
  },
  label: {
    fontSize: 26,
    fontWeight: "900",
    textShadowColor: "rgba(255, 255, 255, 0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
