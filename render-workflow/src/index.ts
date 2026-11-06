
import { flow, type FlowContext } from "@renderinc/sdk/workflows";

type OrderItem = {
  dishId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type OrderInput = {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  pickupSlot?: string;
};

function validateOrder(order: OrderInput) {
  if (!order?.orderId?.trim()) {
    throw new Error("Order ID is required");
  }

  if (!order.customerName?.trim()) {
    throw new Error("Customer name is required");
  }

  if (!Array.isArray(order.items) || order.items.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  for (const item of order.items) {
    if (!item.dishId || !item.name) {
      throw new Error("Invalid dish details");
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Invalid item quantity");
    }

    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
      throw new Error("Invalid item price");
    }
  }

  const subtotal = Number(
    order.items.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    ).toFixed(2)
  );

  return {
    ...order,
    pickupSlot: order.pickupSlot || "Next available",
    subtotal,
    itemCount: order.items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  };
}

function createKitchenTicket(order: ReturnType<typeof validateOrder>) {
  return {
    ticketId: `KT-${order.orderId}`,
    orderId: order.orderId,
    customerName: order.customerName,
    items: order.items,
    itemCount: order.itemCount,
    subtotal: order.subtotal,
    pickupSlot: order.pickupSlot,
    status: "QUEUED"
  };
}

function createReceipt(ticket: ReturnType<typeof createKitchenTicket>) {
  return {
    orderId: ticket.orderId,
    ticketId: ticket.ticketId,
    customerName: ticket.customerName,
    status: ticket.status,
    subtotal: ticket.subtotal,
    message: `Order ${ticket.orderId} has been accepted!`
  };
}

export const processCanteenOrder = flow(
  {
    name: "processCanteenOrder",
    timeoutSeconds: 300
  },
  async function processCanteenOrder(
    ctx: FlowContext,
    order: OrderInput
  ) {
    const validatedOrder = await ctx.step(
      "validate-order",
      validateOrder,
      [order]
    );

    const kitchenTicket = await ctx.step(
      "create-kitchen-ticket",
      createKitchenTicket,
      [validatedOrder]
    );

    const receipt = await ctx.step(
      "create-customer-receipt",
      createReceipt,
      [kitchenTicket]
    );

    return {
      success: true,
      kitchenTicket,
      receipt
    };
  }
);
