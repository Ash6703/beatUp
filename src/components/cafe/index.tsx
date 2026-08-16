import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

import type { PendingCustomer } from "../../engine/order-manager";
import { colors } from "../../theme";
import { CafeBanner } from "./banner";
import { Customer } from "./customer";
import { Table } from "./table";

type CafeSceneProps = {
  orders: readonly PendingCustomer[];
};

export function CafeScene({ orders }: CafeSceneProps) {
  const { width, height } = useWindowDimensions();

  // 4 Tables: 2 Upper row (Top-Mid, Top-Right) and 2 Lower row (Bottom-Mid, Bottom-Right)
  const tablePositions = [
    { x: width * 0.44, y: height * 0.28 },
    { x: width * 0.74, y: height * 0.28 },
    { x: width * 0.44, y: height * 0.58 },
    { x: width * 0.74, y: height * 0.58 },
  ];

  return (
    <View style={styles.scene}>
      {/* Hanging Outdoor-style Restaurant Sign / Banner */}
      <CafeBanner />

      {/* Decorative cafe floor lines / background ambiance */}
      <View style={styles.wallBaseboard} />

      {/* 4 Tables and Seated Customers */}
      {tablePositions.map((pos, index) => {
        const order = orders[index];
        return (
          <React.Fragment key={index}>
            <Table x={pos.x} y={pos.y} />
            {order && (
              <Customer
                customerId={order.customerId}
                orderId={order.items[0]}
                seatX={pos.x + 50}
                seatY={pos.y - 60}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.cafeBackground,
  },
  wallBaseboard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(184, 131, 74, 0.08)",
    borderTopWidth: 2,
    borderTopColor: "rgba(184, 131, 74, 0.2)",
  },
});
