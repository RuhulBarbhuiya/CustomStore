import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div>
          <p>About Us</p>
          <h1>Simple custom products for everyday ideas.</h1>
          <span>
            Custom Store helps you personalize T-shirts, hoodies, mugs, caps,
            and full sleeves with text and uploaded artwork.
          </span>
          <Link href="/tshirts">Browse Products</Link>
        </div>
        <img src="/tshirts/set3/redfront.png" alt="Custom red T-shirt" />
      </section>

      <section className={styles.points}>
        <div>
          <h2>Pick</h2>
          <p>Choose a product from the store.</p>
        </div>
        <div>
          <h2>Design</h2>
          <p>Add text or images to front and back.</p>
        </div>
        <div>
          <h2>Order</h2>
          <p>Review your cart and checkout securely.</p>
        </div>
      </section>
    </main>
  );
}
