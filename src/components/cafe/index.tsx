import React from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";

import type { PendingCustomer } from "../../engine/order-manager";
import { colors } from "../../theme";
import { Customer } from "./customer";
import { Table } from "./table";

type CafeSceneProps = {
  orders: readonly PendingCustomer[];
};

export function CafeScene({ orders }: CafeSceneProps) {
  const { width, height } = useWindowDimensions();
  const tableY = height * 0.56;
  const tablePositions = [width * 0.2, width * 0.5, width * 0.8].map((x) => ({
    x,
    y: tableY,
  }));

  return (
    <View style={styles.scene}>
      <Text style={styles.title}>BEATUP CAFE</Text>

      {tablePositions.map((pos, index) => {
        const order = orders[index];
        return (
          <React.Fragment key={index}>
            <Table x={pos.x} y={pos.y} />
            {order && (
              <Customer
                customerId={order.customerId}
                orderId={order.items[0]}
                seatX={pos.x}
                seatY={pos.y - 92}
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
  title: {
    position: "absolute",
    top: 28,
    alignSelf: "center",
    fontSize: 28,
    fontWeight: "900",
    color: colors.textDark,
  },
});
