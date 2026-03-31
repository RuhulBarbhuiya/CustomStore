import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div>

      <section className={styles.hero}>

        <div className={styles.left}>
          <p className={styles.tag}>Design Your Merch</p>

          <h1>The Custom Store</h1>

          <p className={styles.description}>
            Everything is designed with you in mind.
            Explore handpicked products tailored
            to match your style and preferences.
          </p>
        </div>

        <div className={styles.right}>
          <img src="/homepage/hero.png" alt="hero" />
        </div>

      </section>


      <section className={styles.products}> {/* product section */}

        <p className={styles.subheading}>
          Choose from our customizable products
        </p>

        <h2 className={styles.heading}>
          Browse Products
        </h2>

        <div className={styles.grid}> {/* product grid */}

          <div className={styles.card}>
            <img src="/homepage/tshirt.png" alt="tshirt" />
            <h3>T-shirts</h3>
          </div>

          <div className={styles.card}>
            <img src="/homepage/hoodie.png" alt="hoodie" />
            <h3>Hoodies</h3>
          </div>

          <div className={styles.card}>
            <img src="/homepage/mug.png" alt="mug" />
            <h3>Mug</h3>
          </div>

          <div className={styles.card}>
            <img src="/homepage/flag.png" alt="flag" />
            <h3>Flag</h3>
          </div>

          <div className={styles.card}>
            <img src="/homepage/cap.png" alt="mug" />
            <h3>Caps</h3>
          </div>

          <div className={styles.card}>
            <img src="/homepage/cases.png" alt="mug" />
            <h3>Phone Cases</h3>
          </div>

        </div>

      </section>

    </div>
  );
}