import React, { useCallback, useRef, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

import { BPM } from "../../constants";
import { CafeScene } from "../../components/cafe";
import { Drumkit } from "../../components/drumkit";
import { DEMO_ORDERS, ORDER_PATTERNS } from "../../engine/patterns";
import { OrderManager } from "../../engine/order-manager";
import { PatternMatcher } from "../../engine/pattern-matcher";
import { judgeRhythm } from "../../engine/rhythm-judge";
import type { TomHitEvent } from "../../engine/types";
import { useClickTrack } from "../../hooks/use-click-track";
import { useGameAudio, playFromStart } from "../../hooks/use-game-audio";
import { useKeyboardTomInput } from "../../hooks/use-keyboard-tom-input";

export function GameScreen() {
  const audio = useGameAudio();
  const [orders, setOrders] = useState(() =>
    DEMO_ORDERS.map((order) => ({
      customerId: order.customerId,
      items: order.items.map((item) => item.patternId),
    })),
  );

  const matcherRef = useRef<PatternMatcher | null>(null);
  const orderManagerRef = useRef<OrderManager | null>(null);

  if (!matcherRef.current) {
    matcherRef.current = new PatternMatcher(ORDER_PATTERNS);
  }
  if (!orderManagerRef.current) {
    orderManagerRef.current = new OrderManager(DEMO_ORDERS);
  }

  useClickTrack(audio.click, true);

  const handleHit = useCallback(
    (hit: TomHitEvent) => {
      void playFromStart(audio.toms[hit.tom]);

      const match = matcherRef.current!.push(hit);
      if (!match) return;

      const rhythm = judgeRhythm(match.hits, BPM);
      const served = orderManagerRef.current!.serve(match.patternId);

      if (__DEV__) {
        console.log("[BeatUP]", {
          pattern: match.patternId,
          grade: rhythm.grade,
          consistency: Math.round(rhythm.consistency),
          averageErrorMs: Math.round(rhythm.averageErrorMs),
          servedCustomer: served?.customerId ?? null,
        });
      }

      setOrders(orderManagerRef.current!.getPendingOrders());
    },
    [audio],
  );

  useKeyboardTomInput(handleHit);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <CafeScene orders={orders} />
      <Drumkit onHit={handleHit} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
