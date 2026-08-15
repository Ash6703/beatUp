import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import type { SharedValue } from "react-native-reanimated";

import type { OrderId } from "../../engine/types";
import { colors } from "../../theme";
import { Customer, type CustomerPhase } from "./customer";
import { Table } from "./table";

type CafeSceneProps = {
  customerPhase: CustomerPhase;
  orderId: OrderId;
  patienceProgress: SharedValue<number>;
};

/**
 * Multiple tables are visible; the one customer always sits at the first
 * one — no pathing needed yet (beatup.md "Screen layout").
 */
export function CafeScene({ customerPhase, orderId, patienceProgress }: CafeSceneProps) {
  const { width, height } = useWindowDimensions();
  const tableY = height * 0.55;
  const tablePositions = [width * 0.2, width * 0.5, width * 0.8].map((x) => ({ x, y: tableY }));
  const seat = tablePositions[0];

  return (
    <View style={styles.scene}>
      {tablePositions.map((pos, i) => (
        <Table key={i} x={pos.x} y={pos.y} />
      ))}
      <Customer
        phase={customerPhase}
        seatX={seat.x}
        seatY={seat.y - 90}
        orderId={orderId}
        patienceProgress={patienceProgress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    backgroundColor: colors.cafeBackground,
  },
});
