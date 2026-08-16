import React from "react";
import { StyleSheet, View } from "react-native";

import { colors, radii } from "../../theme";

type TableProps = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export function Table({ x, y, width = 100, height = 58 }: TableProps) {
  return (
    <View style={[styles.container, { left: x, top: y, width }]}>
      {/* Table shadow */}
      <View style={[styles.tableShadow, { width: width + 8 }]} />

      {/* Table Leg / Pedestal */}
      <View style={styles.pedestal} />
      <View style={styles.base} />

      {/* Table Top Surface */}
      <View style={[styles.tableTop, { width, height }]}>
        {/* Table runner / cloth */}
        <View style={styles.runner} />
        {/* Table rim highlight */}
        <View style={styles.rimHighlight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
  },
  tableShadow: {
    position: "absolute",
    bottom: -10,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  pedestal: {
    position: "absolute",
    top: 40,
    width: 14,
    height: 24,
    backgroundColor: "#6E4524",
    borderWidth: 1.5,
    borderColor: "#4A2B14",
  },
  base: {
    position: "absolute",
    bottom: -6,
    width: 48,
    height: 10,
    borderRadius: radii.sm,
    backgroundColor: "#523218",
  },
  tableTop: {
    backgroundColor: colors.tableWood,
    borderRadius: radii.md,
    borderWidth: 3,
    borderColor: "#6C3E1B",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  runner: {
    width: "45%",
    height: "100%",
    backgroundColor: "#F4E4C1",
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: "#D8BC8C",
    opacity: 0.85,
  },
  rimHighlight: {
    position: "absolute",
    top: 2,
    left: 4,
    right: 4,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
});
