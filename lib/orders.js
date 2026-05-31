const ORDERS_KEY = "orders";
const ORDERS_CHANGE_EVENT = "orders:changed";

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function notifyOrdersChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ORDERS_CHANGE_EVENT));
  }
}

export function getOrders() {
  if (!canUseStorage()) return [];

  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveOrder({ items, total, customer, payment }) {
  if (!canUseStorage()) return [];

  const order = {
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    status: "Processing",
    payment: payment || {
      provider: "Manual",
      status: "Pending",
    },
    items,
    total,
    customer,
  };
  const orders = [order, ...getOrders()];

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  notifyOrdersChange();
  return orders;
}

export function getOrdersSnapshot() {
  if (!canUseStorage()) return "[]";

  return localStorage.getItem(ORDERS_KEY) || "[]";
}

export function subscribeToOrders(callback) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(ORDERS_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ORDERS_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
