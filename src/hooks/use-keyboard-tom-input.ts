import { useEffect } from "react";
import { Platform } from "react-native";

import type { TomHitEvent, TomIndex } from "../engine/types";

const KEY_TO_TOM: Record<string, TomIndex> = { "1": 1, "2": 2, "3": 3, "4": 4 };

/**
 * Desktop testing convenience (beatup.md "Platform & orientation"): keys
 * 1-4 map to toms 1-4, routed through the same TomHitEvent as touch input.
 * Web-only — physical keyboard input isn't part of the mobile product.
 */
export function useKeyboardTomInput(onHit: (hit: TomHitEvent) => void): void {
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const tom = KEY_TO_TOM[event.key];
      if (!tom || event.repeat) return;
      onHit({ tom, timestamp: performance.now() });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onHit]);
}
