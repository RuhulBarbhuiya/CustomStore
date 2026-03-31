import { products } from "../../data/products";
import styles from "./product.module.css";
import Link from "next/link";

export default async function ProductDetail({ params }) {

  const { id } = await params;   // 👈 unwrap params

  const product = products.find(
    (item) => item.id == id
  );

  if (!product) {
    return <h1>Product not found</h1>;
  }

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

          <p className={styles.price}>
            Rs {product.price}
          </p>

          <div className={styles.size}>
            <span>Size:</span>
            <button>S</button>
            <button>M</button>
            <button>L</button>
            <button>XL</button>
          </div>

          <div className={styles.buttons}>
            <h3>Create a distinct identity by adding your Brand Logo or Name.</h3>

<Link href={`/customize/${product.id}`}>
  <button className={styles.customise}>
    Customise
  </button>
</Link>
            <button className={styles.buy}>Buy Now</button>
            <button className={styles.cart}>Add to Cart</button>
          </div>

          <h3>Description</h3>

          <p className={styles.desc}>
            High quality cotton T-shirt with comfortable fabric and durable print.
          </p>

        </div>

      </section>

    </div>
  );
}