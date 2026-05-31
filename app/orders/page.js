"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { getOrdersSnapshot, subscribeToOrders } from "@/lib/orders";
import styles from "./orders.module.css";

export default function OrdersPage() {
  const ordersSnapshot = useSyncExternalStore(
    subscribeToOrders,
    getOrdersSnapshot,
    () => "[]"
  );

  const orders = useMemo(() => {
    try {
      return JSON.parse(ordersSnapshot);
    } catch {
      return [];
    }
  }, [ordersSnapshot]);

  return (
    <main className={styles.container}>
      <section className={styles.banner}>
        <h1>My Orders</h1>
        <p>HOME | ORDERS</p>
      </section>

      {orders.length === 0 ? (
        <section className={styles.empty}>
          <p>No orders yet.</p>
          <Link href="/tshirts">Shop T-shirts</Link>
        </section>
      ) : (
        <section className={styles.orders}>
          {orders.map((order) => (
            <article className={styles.order} key={order.id}>
              <div className={styles.orderHeader}>
                <div>
                  <h2>{order.id}</h2>
                  <p>{new Date(order.date).toLocaleString()}</p>
                </div>
                <span>{order.status}</span>
              </div>

              <div className={styles.items}>
                {order.items.map((item) => (
                  <div className={styles.item} key={item.id}>
                    <img src={item.frontDesign || item.image} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                    </div>
                    <strong>Rs {item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.total}>
                <span>Total</span>
                <strong>Rs {order.total}</strong>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
