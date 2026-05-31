"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { getUserSnapshot, subscribeToUser } from "@/lib/user";
import styles from "@/app/tshirts/[id]/product.module.css";

export default function AddCapToCart({ product }) {
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    () => "null"
  );
  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please sign in to add products to cart.");
      router.push("/login");
      return;
    }

    addToCart({ ...product, size: "Free Size" });
  };

  return (
    <button type="button" className={styles.cart} onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
