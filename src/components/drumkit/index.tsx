import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { TomHitEvent, TomIndex } from "../../engine/types";
import { colors, radii, spacing } from "../../theme";
import { Tom } from "./tom";

const TOM_ORDER: readonly TomIndex[] = [1, 2, 3, 4];

type DrumkitProps = {
  onHit: (hit: TomHitEvent) => void;
};

export function Drumkit({ onHit }: DrumkitProps) {
  return (
    <View style={styles.stage}>
      <View style={styles.stageHeader}>
        <Text style={styles.stageTitle}>🧑‍🍳  BEAT STAGE</Text>
        <Text style={styles.stageHint}>1  2  3  4</Text>
      </View>
      <View style={styles.controls}>
        {TOM_ORDER.map((tom) => (
          <Tom key={tom} tom={tom} onHit={onHit} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    position: "absolute",
    left: spacing.md,
    bottom: spacing.md,
    width: "88%",
    maxWidth: 320,
    height: 164,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.stageBackground,
    borderWidth: 3,
    borderColor: colors.bubbleBorder,
    justifyContent: "space-between",
  },
  stageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stageTitle: {
    color: colors.bubbleBackground,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  stageHint: {
    color: colors.tomHit,
    fontSize: 12,
    fontWeight: "700",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
});
