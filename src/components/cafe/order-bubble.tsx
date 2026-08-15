import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { interpolateColor, useAnimatedStyle, type SharedValue } from "react-native-reanimated";

import type { OrderId } from "../../engine/types";
import { colors, radii, spacing } from "../../theme";

type OrderBubbleProps = {
  orderId: OrderId;
  patienceProgress: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
};

export function OrderBubble({ orderId, patienceProgress, style }: OrderBubbleProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      patienceProgress.value,
      [0, 0.5, 1],
      [colors.patienceGreen, colors.patienceYellow, colors.patienceRed],
    ),
  }));

  return (
    <Animated.View style={[styles.bubble, style, animatedStyle]}>
      <Text style={styles.letter}>{orderId}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    borderWidth: 4,
    backgroundColor: colors.bubbleBackground,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  letter: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textDark,
  },
});
