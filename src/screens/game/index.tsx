import React, { useCallback, useMemo, useRef, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

import { BPM } from "../../constants";
import { CafeScene } from "../../components/cafe";
import { Drumkit } from "../../components/drumkit";
import { DEMO_ORDERS, ORDER_PATTERNS } from "../../engine/patterns";
import { OrderManager, type PendingCustomer } from "../../engine/order-manager";
import { PatternMatcher } from "../../engine/pattern-matcher";
import { createRhythmSession } from "../../engine/rhythm-session";
import { judgeRhythm } from "../../engine/rhythm-judge";
import type { TomHitEvent } from "../../engine/types";
import { useBackingTrackAudio } from "../../hooks/use-backing-track-audio";
import { useClickTrack } from "../../hooks/use-click-track";
import { playTomSfx, useTomSfx } from "../../hooks/use-tom-sfx";
import { useKeyboardTomInput } from "../../hooks/use-keyboard-tom-input";

export function GameScreen() {
  const backingTrack = useBackingTrackAudio();
  const tomSfx = useTomSfx();
  const rhythmSession = useMemo(() => createRhythmSession(BPM), []);

  const [orders, setOrders] = useState<readonly PendingCustomer[]>(() =>
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

  useClickTrack(backingTrack, true);

  const handleHit = useCallback(
    (hit: TomHitEvent) => {
      // SFX playback is completely independent from the backing-track player.
      void playTomSfx(tomSfx[hit.tom]);

      const match = matcherRef.current!.push(hit);
      if (!match) return;

      const rhythm = judgeRhythm(match.hits, rhythmSession);
      const served = orderManagerRef.current!.serve(match.patternId);

      if (__DEV__) {
        console.log("[BeatUP] pattern result", {
          pattern: match.patternId,
          beatDurationMs: rhythmSession.beatDurationMs,
          inputs: rhythm.inputs,
          totalErrorMs: rhythm.totalErrorMs,
          quality: rhythm.grade,
          servedCustomer: served?.customerId ?? null,
        });
      }

      setOrders(orderManagerRef.current!.getPendingOrders());
    },
    [rhythmSession, tomSfx],
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
