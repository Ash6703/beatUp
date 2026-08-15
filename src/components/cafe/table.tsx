import React from "react";
import { StyleSheet, View } from "react-native";

import { colors, radii } from "../../theme";

type TableProps = {
  x: number;
  y: number;
};

/** Placeholder box — layout/function matter more than final art at this stage (beatup.md). */
export function Table({ x, y }: TableProps) {
  return <View style={[styles.table, { left: x, top: y }]} />;
}

const styles = StyleSheet.create({
  table: {
    position: "absolute",
    width: 90,
    height: 60,
    borderRadius: radii.sm,
    backgroundColor: colors.tableWood,
  },
});
