import styles from "./tshirts.module.css";
import Link from "next/link";
import { products } from "../data/products";

export default function Tshirts() {
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
              key={product.id}
              href={`/tshirts/${product.id}`}   // ✅ FIXED HERE
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