import React from "react";
import { StyleSheet, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import type { TomHitEvent, TomIndex } from "../../engine/types";
import { colors } from "../../theme";
import { Tom } from "./tom";

const TOM_ORDER: readonly TomIndex[] = [1, 2, 3, 4];
// Gentle curve: outer toms sit a little higher than the inner pair.
const TOM_LIFT = [10, 0, 0, 10];

type DrumkitProps = {
  beatInBarSV: SharedValue<number>;
  onHit: (hit: TomHitEvent) => void;
};

export function Drumkit({ beatInBarSV, onHit }: DrumkitProps) {
  return (
    <View style={styles.stage}>
      <View style={styles.kit}>
        {TOM_ORDER.map((tom, i) => (
          <View key={tom} style={{ marginTop: TOM_LIFT[i] }}>
            <Tom tom={tom} beatInBarSV={beatInBarSV} onHit={onHit} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: colors.stageBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  kit: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-end",
  },
});
