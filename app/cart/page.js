"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { getCartSnapshot, removeFromCart, subscribeToCart } from "@/lib/cart";
import styles from "./cart.module.css";

export default function CartPage() {
  const cartSnapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    () => "[]"
  );

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

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };

  return (
    <main className={styles.container}>
      <section className={styles.banner}>
        <h1>Your Cart</h1>
        <p>HOME | CART</p>
      </section>

      {cartItems.length === 0 ? (
        <p className={styles.empty}>Your cart is empty.</p>
      ) : (
        <section className={styles.cartList}>
          {cartItems.map((item) => (
            <div className={styles.cartItem} key={item.id}>
              {item.customized ? (
                <div className={styles.designPreviews}>
                  <div>
                    <img src={item.frontDesign || item.image} alt={`${item.name} front`} />
                    <span>Front</span>
                  </div>
                  <div>
                    <img src={item.backDesign || item.backImage || item.image} alt={`${item.name} back`} />
                    <span>Back</span>
                  </div>
                </div>
              ) : (
                <img src={item.image} alt={item.name} />
              )}

              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p>Rs {item.price}</p>
                {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                {item.size && <p>Size: {item.size}</p>}
                <p>Quantity: {item.quantity}</p>
              </div>

              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className={styles.total}>
            <span>Total</span>
            <strong>Rs {totalPrice}</strong>
          </div>

          <Link href="/checkout" className={styles.checkoutBtn}>
            Checkout
          </Link>
        </section>
      )}
    </main>
  );
}
