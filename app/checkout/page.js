"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  clearCart,
  getCartSnapshot,
  subscribeToCart,
} from "@/lib/cart";
import { getUserSnapshot, subscribeToUser } from "@/lib/user";
import { saveOrder } from "@/lib/orders";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => "[]"
  );
  const userSnapshot = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    () => "null"
  );
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartItems = useMemo(() => {
    try {
      return JSON.parse(cartSnapshot);
    } catch {
      return [];
    }
  }, [cartSnapshot]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [cartItems]);
  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0 || !user) return;

    const formData = new FormData(event.currentTarget);

    saveOrder({
      items: cartItems,
      total: totalPrice,
      customer: {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        pincode: formData.get("pincode"),
      },
    });
    clearCart();
    setOrderPlaced(true);
  };

  return (
    <main className={styles.container}>
      <section className={styles.banner}>
        <h1>Checkout</h1>
        <p>HOME | CHECKOUT</p>
      </section>

      {orderPlaced ? (
        <section className={styles.success}>
          <h2>Order placed successfully.</h2>
          <p>Thank you for shopping with Custom Store.</p>
          <Link href="/tshirts">Continue Shopping</Link>
        </section>
      ) : !user ? (
        <section className={styles.empty}>
          <p>Please sign in to continue to checkout.</p>
          <Link href="/login">Sign In</Link>
        </section>
      ) : cartItems.length === 0 ? (
        <section className={styles.empty}>
          <p>Your cart is empty.</p>
          <Link href="/tshirts">Shop T-shirts</Link>
        </section>
      ) : (
        <section className={styles.checkoutGrid}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Shipping Details</h2>

            <input name="name" type="text" placeholder="Full name" required />
            <input name="email" type="email" placeholder="Email address" required />
            <input name="phone" type="tel" placeholder="Phone number" required />
            <input name="address" type="text" placeholder="Address" required />
            <input name="city" type="text" placeholder="City" required />
            <input name="pincode" type="text" placeholder="Pincode" required />

            <button type="submit">Place Order</button>
          </form>

          <div className={styles.summary}>
            <h2>Order Summary</h2>

            {cartItems.map((item) => (
              <div className={styles.summaryItem} key={item.id}>
                <img src={item.frontDesign || item.image} alt={item.name} />

                <div>
                  <h3>{item.name}</h3>
                  {item.size && <p>Size: {item.size}</p>}
                  <p>Quantity: {item.quantity}</p>
                  <p>Rs {item.price * item.quantity}</p>
                </div>
              </div>
            ))}

            <div className={styles.total}>
              <span>Total</span>
              <strong>Rs {totalPrice}</strong>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
