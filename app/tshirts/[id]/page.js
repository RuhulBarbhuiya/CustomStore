"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ FIX
import styles from "./product.module.css";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams(); // ✅ get params safely

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Product:", data);
        setProduct(data);
      });
  }, [params?.id]); // ✅ safe dependency

  if (!product) {
    return <h1>Loading...</h1>;
  }

  // handle both id / _id
  const productId = product._id || product.id;

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
            <button>S</button>
            <button>M</button>
            <button>L</button>
            <button>XL</button>
          </div>

          <div className={styles.buttons}>
            <h3>
              Create a distinct identity by adding your Brand Logo or Name.
            </h3>

            <Link href={`/customize/${productId}`}>
              <button className={styles.customise}>
                Customise
              </button>
            </Link>

            <button className={styles.buy}>Buy Now</button>
            <button className={styles.cart}>Add to Cart</button>
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