import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from "react-native-reanimated";

import { WALK_DURATION_MS } from "../../constants";
import type { OrderId } from "../../engine/types";
import { colors } from "../../theme";
import { OrderBubble } from "./order-bubble";

export type CustomerPhase = "idle" | "entering" | "seated" | "success" | "leaving";

type CustomerProps = {
  phase: CustomerPhase;
  seatX: number;
  seatY: number;
  orderId: OrderId;
  patienceProgress: SharedValue<number>;
};

export function Customer({ phase, seatX, seatY, orderId, patienceProgress }: CustomerProps) {
  const { width } = useWindowDimensions();
  const offscreenX = width + 80;
  const x = useSharedValue(offscreenX);

  useEffect(() => {
    if (phase === "entering") {
      x.value = withTiming(seatX, { duration: WALK_DURATION_MS });
    } else if (phase === "leaving") {
      x.value = withTiming(offscreenX, { duration: WALK_DURATION_MS });
    }
  }, [phase, seatX, offscreenX, x]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, { top: seatY }, animatedStyle]}>
      <OrderBubble orderId={orderId} patienceProgress={patienceProgress} />
      {phase === "success" && (
        <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.successBadge}>
          ✅
        </Animated.Text>
      )}
      <Animated.View style={styles.body} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    alignItems: "center",
  },
  body: {
    width: 56,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.customerBody,
  },
  successBadge: {
    position: "absolute",
    top: -28,
    fontSize: 24,
  },
});
