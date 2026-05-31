"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./product.module.css";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import { getUserSnapshot, subscribeToUser } from "@/lib/user";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    () => "null"
  );

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      });
  }, [params?.id]);

  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  if (!product) {
    return <h1>Loading...</h1>;
  }

  const productId = product._id || product.id;

  const requireSignIn = () => {
    if (user) return true;

    alert("Please sign in to add products to cart or checkout.");
    router.push("/login");
    return false;
  };

  const buildCartItem = () => ({
    id: productId,
    name: product.name,
    price: product.price,
    image: product.image,
    size: selectedSize,
  });

  const handleAddToCart = () => {
    if (!requireSignIn()) return;
    addToCart(buildCartItem());
  };

  const handleBuyNow = () => {
    if (!requireSignIn()) return;
    addToCart(buildCartItem());
    router.push("/checkout");
  };

  return (
    <div>
      <section className={styles.hero}>
        <h1>Product Details</h1>
        <p>HOME | Product Detail</p>
      </section>

      <section className={styles.container}>
        <div className={styles.image}>
          <img src={product.image} alt={product.name} />
        </div>

        <div className={styles.details}>
          <h2>{product.name}</h2>

          <p className={styles.price}>Rs {product.price}</p>

          <div className={styles.size}>
            <span>Size:</span>
            {["S", "M", "L", "XL"].map((size) => (
              <button
                type="button"
                key={size}
                className={selectedSize === size ? styles.selectedSize : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <div className={styles.buttons}>
            {product.isCustomizable && (
              <>
                <h3>Create a distinct identity by adding your Brand Logo or Name.</h3>

                <Link href={`/customize/product/${productId}`}>
                  <button className={styles.customise}>Customise</button>
                </Link>
              </>
            )}

            <button className={styles.buy} onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className={styles.cart} onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          <h3>Description</h3>

          <p className={styles.desc}>
            {product.description || "No description available"}
          </p>
        </div>
      </section>
    </div>
  );
}
