import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { usePatienceProgress } from "../../hooks/use-patience-progress";

import type { OrderId } from "../../engine/types";
import { PATIENCE_WINDOW_MS } from "../../constants";
import { colors } from "../../theme";
import { OrderBubble } from "./order-bubble";

type CustomerProps = {
  customerId: string;
  orderId: OrderId;
  seatX: number;
  seatY: number;
};

export function Customer({ customerId, orderId, seatX, seatY }: CustomerProps) {
  const [orderStartTime] = useState(() => performance.now());
  const patienceProgress = usePatienceProgress(orderStartTime, PATIENCE_WINDOW_MS);

  return (
    <>
      <Text style={[styles.customer, { left: seatX - 28, top: seatY }]}>👤</Text>
      <Text style={[styles.id, { left: seatX - 8, top: seatY + 48 }]}>{customerId}</Text>
      <OrderBubble
        orderId={orderId}
        patienceProgress={patienceProgress}
        style={{ left: seatX - 24, top: seatY - 58 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  customer: {
    position: "absolute",
    fontSize: 52,
  },
  id: {
    position: "absolute",
    fontSize: 14,
    fontWeight: "800",
    color: colors.textDark,
  },
});
