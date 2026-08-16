import React from "react";
import { StyleSheet, View } from "react-native";

import type { TomHitEvent } from "../../engine/types";
import { spacing } from "../../theme";
import { ArcadeButton } from "./arcade-button";
import { DrummerStage } from "./stage";

type DrumkitProps = {
  onHit: (hit: TomHitEvent) => void;
};

export { DrummerStage };

export function Drumkit({ onHit }: DrumkitProps) {
  return (
    <>
      {/* Left Arcade Buttons: Tom 1 & Tom 2 */}
      <View style={styles.leftCluster}>
        <ArcadeButton tom={1} onHit={onHit} />
        <ArcadeButton tom={2} onHit={onHit} />
      </View>

      {/* Right Arcade Buttons: Tom 3 & Tom 4 */}
      <View style={styles.rightCluster}>
        <ArcadeButton tom={3} onHit={onHit} />
        <ArcadeButton tom={4} onHit={onHit} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  leftCluster: {
    position: "absolute",
    left: spacing.lg,
    bottom: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    zIndex: 20,
  },
  rightCluster: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    zIndex: 20,
  },
});
