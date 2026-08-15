import type { CustomerOrder, OrderId } from "./types";

export type PendingCustomer = {
  readonly customerId: string;
  readonly items: readonly OrderId[];
};

export type ServedOrderItem = {
  readonly customerId: string;
  readonly patternId: OrderId;
  readonly remainingItems: readonly OrderId[];
  readonly orderComplete: boolean;
};

/**
 * Assigns a recognized pattern to the earliest pending customer whose next
 * requested item matches it. Pattern recognition never knows about customers.
 */
export class OrderManager {
  private orders: PendingCustomer[];

  constructor(orders: readonly CustomerOrder[]) {
    this.orders = orders.map((order) => ({
      customerId: order.customerId,
      items: order.items.map((item) => item.patternId),
    }));
  }

  reset(orders: readonly CustomerOrder[]): void {
    this.orders = orders.map((order) => ({
      customerId: order.customerId,
      items: order.items.map((item) => item.patternId),
    }));
  }

  getPendingOrders(): readonly PendingCustomer[] {
    return this.orders;
  }

  serve(patternId: OrderId): ServedOrderItem | null {
    const index = this.orders.findIndex(
      (order) => order.items.length > 0 && order.items[0] === patternId,
    );

    if (index === -1) return null;

    const order = this.orders[index];
    const remainingItems = order.items.slice(1);
    const served: ServedOrderItem = {
      customerId: order.customerId,
      patternId,
      remainingItems,
      orderComplete: remainingItems.length === 0,
    };

    if (remainingItems.length === 0) {
      this.orders = this.orders.filter((_, orderIndex) => orderIndex !== index);
    } else {
      this.orders = this.orders.map((item, orderIndex) =>
        orderIndex === index ? { ...item, items: remainingItems } : item,
      );
    }

    return served;
  }
}
