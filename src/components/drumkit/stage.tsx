import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { colors, radii } from "../../theme";

export function DrummerStage() {
  // Ambient drummer bobbing animation
  const bobY = useSharedValue(0);
  const leftStickAngle = useSharedValue(-15);
  const rightStickAngle = useSharedValue(15);

  useEffect(() => {
    bobY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 400, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );

    leftStickAngle.value = withRepeat(
      withSequence(
        withTiming(-28, { duration: 350, easing: Easing.inOut(Easing.quad) }),
        withTiming(-10, { duration: 350, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );

    rightStickAngle.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 300, easing: Easing.inOut(Easing.quad) }),
        withTiming(26, { duration: 300, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
  }, [bobY, leftStickAngle, rightStickAngle]);

  const animatedDrummerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobY.value }],
  }));

  const animatedLeftStickStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${leftStickAngle.value}deg` }],
  }));

  const animatedRightStickStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rightStickAngle.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      {/* Background Spotlight / Stage glow */}
      <View style={styles.spotlight} />

      {/* Drummer character & drum kit layer */}
      <View style={styles.sceneLayer}>
        {/* Cymbal Left (Hi-Hat) */}
        <View style={styles.hiHatStand}>
          <View style={styles.cymbalDisc} />
          <View style={styles.cymbalStem} />
        </View>

        {/* Cymbal Right (Crash) */}
        <View style={styles.crashStand}>
          <View style={[styles.cymbalDisc, styles.crashDisc]} />
          <View style={styles.cymbalStem} />
        </View>

        {/* Drummer Character */}
        <Animated.View style={[styles.drummer, animatedDrummerStyle]}>
          {/* Chef Hat & Head */}
          <Text style={styles.drummerAvatar}>🧑‍🍳</Text>

          {/* Drumsticks */}
          <Animated.View style={[styles.stick, styles.stickLeft, animatedLeftStickStyle]} />
          <Animated.View style={[styles.stick, styles.stickRight, animatedRightStickStyle]} />
        </Animated.View>

        {/* Drum Kit Front: Snare, Toms, Bass Drum */}
        <View style={styles.drumSet}>
          {/* Tom 1 & 2 on kit */}
          <View style={styles.kitTomsRow}>
            <View style={[styles.miniTom, styles.tomLeft]}>
              <View style={styles.tomRim} />
            </View>
            <View style={[styles.miniTom, styles.tomRight]}>
              <View style={styles.tomRim} />
            </View>
          </View>

          {/* Bass Drum Center */}
          <View style={styles.bassDrum}>
            <View style={styles.bassDrumInner}>
              <Text style={styles.bassLogo}>🥁</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stage Platform Base */}
      <View style={styles.stagePlatform}>
        <View style={styles.stageSurface} />
        <View style={styles.stageFrontRiser}>
          <View style={styles.plaque}>
            <Text style={styles.plaqueText}>★ BEAT STAGE ★</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    top: "14%",
    width: 210,
    height: 180,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 2,
  },
  spotlight: {
    position: "absolute",
    top: 4,
    width: 170,
    height: 140,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255, 235, 179, 0.4)",
    zIndex: 0,
  },
  sceneLayer: {
    width: "100%",
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    marginBottom: -4,
  },
  drummer: {
    position: "absolute",
    top: 6,
    alignItems: "center",
    zIndex: 2,
  },
  drummerAvatar: {
    fontSize: 54,
  },
  stick: {
    position: "absolute",
    width: 22,
    height: 4,
    backgroundColor: "#E2A355",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#884C1C",
  },
  stickLeft: {
    top: 36,
    left: -12,
  },
  stickRight: {
    top: 36,
    right: -12,
  },
  hiHatStand: {
    position: "absolute",
    left: 18,
    bottom: 24,
    alignItems: "center",
    zIndex: 3,
  },
  crashStand: {
    position: "absolute",
    right: 18,
    bottom: 28,
    alignItems: "center",
    zIndex: 3,
  },
  cymbalDisc: {
    width: 38,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: "#F4C430",
    borderWidth: 2,
    borderColor: "#B8860B",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  crashDisc: {
    width: 44,
    height: 11,
    transform: [{ rotate: "10deg" }],
  },
  cymbalStem: {
    width: 3,
    height: 46,
    backgroundColor: "#9E9E9E",
    borderWidth: 0.5,
    borderColor: "#616161",
  },
  drumSet: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    zIndex: 4,
  },
  kitTomsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: -10,
    zIndex: 5,
  },
  miniTom: {
    width: 32,
    height: 22,
    backgroundColor: colors.tomShell,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#7A3E1D",
    alignItems: "center",
  },
  tomLeft: {
    transform: [{ rotate: "-8deg" }],
  },
  tomRight: {
    transform: [{ rotate: "8deg" }],
  },
  tomRim: {
    width: 28,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.tomHead,
    borderWidth: 1.5,
    borderColor: "#B57A42",
  },
  bassDrum: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.stageBackground,
    borderWidth: 4,
    borderColor: "#3E2314",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bassDrumInner: {
    width: 54,
    height: 54,
    borderRadius: radii.pill,
    backgroundColor: "#FDF5E6",
    borderWidth: 2,
    borderColor: "#D8A46B",
    alignItems: "center",
    justifyContent: "center",
  },
  bassLogo: {
    fontSize: 22,
  },
  stagePlatform: {
    width: "100%",
    alignItems: "center",
    zIndex: 5,
  },
  stageSurface: {
    width: "96%",
    height: 16,
    borderRadius: radii.md,
    backgroundColor: "#8D5B38",
    borderWidth: 2,
    borderColor: "#5A3318",
  },
  stageFrontRiser: {
    width: "100%",
    height: 26,
    backgroundColor: colors.stageBackground,
    borderBottomLeftRadius: radii.md,
    borderBottomRightRadius: radii.md,
    borderWidth: 2,
    borderColor: "#3E2314",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  plaque: {
    backgroundColor: "#F5C77E",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: radii.sm,
    borderWidth: 1.5,
    borderColor: "#9E6B20",
  },
  plaqueText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#4A2711",
    letterSpacing: 1,
  },
});
