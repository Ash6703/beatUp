import { useEffect, useState } from "react";

import { SUCCESS_HOLD_MS, WALK_DURATION_MS } from "../../constants";
import { ORDER_SEQUENCE } from "../../engine/patterns";

export type GamePhase = "idle" | "entering" | "serving" | "success" | "leaving" | "done";

/**
 * Drives the fixed Stage 1 sequence: customer walks in -> order A -> B -> C
 * (success pause between each) -> customer walks out -> done. No new
 * customer spawns after (beatup.md "Core loop"). Stays "idle" (nothing
 * moving, no timers running) until `started` becomes true — the Play tap.
 */
export function useGameFlow(started: boolean) {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [orderIndex, setOrderIndex] = useState(0);
  const [orderStartTime, setOrderStartTime] = useState(() => performance.now());

  useEffect(() => {
    if (started && phase === "idle") {
      setPhase("entering");
    }
  }, [started, phase]);

  useEffect(() => {
    if (phase !== "entering") return;
    const timer = setTimeout(() => {
      setOrderStartTime(performance.now());
      setPhase("serving");
    }, WALK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "success") return;
    const timer = setTimeout(() => {
      const isLastOrder = orderIndex >= ORDER_SEQUENCE.length - 1;
      if (isLastOrder) {
        setPhase("leaving");
      } else {
        setOrderIndex((i) => i + 1);
        setOrderStartTime(performance.now());
        setPhase("serving");
      }
    }, SUCCESS_HOLD_MS);
    return () => clearTimeout(timer);
  }, [phase, orderIndex]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => setPhase("done"), WALK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const markOrderComplete = () => setPhase("success");

  return {
    phase,
    orderId: ORDER_SEQUENCE[orderIndex],
    orderStartTime,
    markOrderComplete,
  };
}
