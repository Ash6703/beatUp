import React, { useCallback, useMemo } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

import { BPM, HIT_WINDOW_MS, PATIENCE_WINDOW_MS } from "../../constants";
import { CafeScene } from "../../components/cafe";
import type { CustomerPhase } from "../../components/cafe/customer";
import { Drumkit } from "../../components/drumkit";
import { ORDER_PATTERNS } from "../../engine/patterns";
import type { TomHitEvent } from "../../engine/types";
import { PatternJudge } from "../../engine/judge";
import { useBeatClock } from "../../hooks/use-beat-clock";
import { useClickTrack } from "../../hooks/use-click-track";
import { useGameAudio, playFromStart } from "../../hooks/use-game-audio";
import { useKeyboardTomInput } from "../../hooks/use-keyboard-tom-input";
import { usePatienceProgress } from "../../hooks/use-patience-progress";
import { useGameFlow, type GamePhase } from "./use-game-flow";

const CUSTOMER_PHASE: Record<GamePhase, CustomerPhase> = {
  entering: "entering",
  serving: "seated",
  success: "success",
  leaving: "leaving",
  done: "leaving",
};

export function GameScreen() {
  const { clock, beatInBarSV } = useBeatClock(BPM);
  const audio = useGameAudio();
  const { phase, orderId, orderStartTime, markOrderComplete } = useGameFlow();
  const patienceProgress = usePatienceProgress(orderStartTime, PATIENCE_WINDOW_MS);

  useClickTrack(clock, audio.click, true);

  const judge = useMemo(() => new PatternJudge(ORDER_PATTERNS[orderId], HIT_WINDOW_MS), [orderId]);

  const handleHit = useCallback(
    (hit: TomHitEvent) => {
      playFromStart(audio.toms[hit.tom]);
      if (phase !== "serving") return;
      const result = judge.judge(clock, hit);
      if (result.kind === "complete") markOrderComplete();
    },
    [phase, judge, clock, audio, markOrderComplete],
  );

  useKeyboardTomInput(handleHit);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <View style={styles.cafeWrapper}>
        <CafeScene customerPhase={CUSTOMER_PHASE[phase]} orderId={orderId} patienceProgress={patienceProgress} />
      </View>
      <View style={styles.stageWrapper}>
        <Drumkit beatInBarSV={beatInBarSV} onHit={handleHit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // Café ~4/5 of the screen, stage ~1/5 (beatup.md "Screen layout").
  cafeWrapper: {
    flex: 4,
  },
  stageWrapper: {
    flex: 1,
  },
});
