import { notFound } from "next/navigation";
import { findCategoryProduct } from "@/app/data/categoryProducts";
import AddCapToCart from "./AddCapToCart";
import styles from "@/app/tshirts/[id]/product.module.css";

export default async function CapDetail({ params }) {
  const { id } = await params;
  const product = findCategoryProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <section className={styles.hero}>
        <h1>Product Details</h1>
        <p>HOME | Cap Detail</p>
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
            <button>Free Size</button>
          </div>

          <div className={styles.buttons}>
            {product.isCustomizable && (
              <h3>Create a distinct identity by adding your Brand Logo or Name.</h3>
            )}

            <AddCapToCart product={product} />
          </div>

          <h3>Description</h3>
          <p className={styles.desc}>
            Comfortable custom cap with front design support, perfect for teams,
            brands, events, and everyday wear.
          </p>
        </div>
      </section>
    </div>
  );
}
