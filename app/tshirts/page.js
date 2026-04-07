"use client";

import styles from "./tshirts.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Tshirts() {
  const [products, setProducts] = useState([]);

  // fetch products from backend
  useEffect(() => {
    fetch("/api/products") 
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>

      <section className={styles.hero}>
        <h1>Our Wide Range Of Products</h1>
        <p>HOME | Tshirts</p>
      </section>

      <section className={styles.products}>

        <div className={styles.grid}>

          {products.map((product) => (
            <Link
              key={product._id}
              href={`/tshirts/${product._id}`} 
              className={styles.card}
            >
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Rs {product.price}</p>
            </Link>
          ))}

        </div>

      </section>

    </div>
  );
}