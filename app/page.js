import styles from "./page.module.css";
import Link from "next/link";

const categories = [
  {
    href: "/tshirts",
    title: "T-shirts",
    image: "/tshirts/set3/redfront.png",
  },
  {
    href: "/hoodies",
    title: "Hoodies",
    image: "/hoodies/set2/blackfront.png",
  },
  {
    href: "/full-sleeves",
    title: "Full Sleeves",
    image: "/fulltshirt/set1/navybluefront.png",
  },
  {
    href: "/mugs",
    title: "Mugs",
    image: "/mugs/white.png",
  },
  {
    href: "/caps",
    title: "Caps",
    image: "/caps/set5/black.png",
  },
];

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.left}>
          <p className={styles.tag}>Design Your Merch</p>

          <h1>The Custom Store</h1>

          <p className={styles.description}>
            Pick a product, customize the front and back with text or images,
            and check out with your finished design.
          </p>

          <div className={styles.heroActions}>
            <Link href="/customize" className={styles.primaryAction}>
              Start Designing
            </Link>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.showcase} aria-label="Custom product preview">
            <img
              className={`${styles.showcaseItem} ${styles.showcaseHoodie}`}
              src="/hoodies/set2/blackfront.png"
              alt="Black hoodie"
            />
            <img
              className={`${styles.showcaseItem} ${styles.showcaseShirt}`}
              src="/tshirts/set3/redfront.png"
              alt="Red t-shirt"
            />
            <img
              className={`${styles.showcaseItem} ${styles.showcaseCap}`}
              src="/caps/set6/green.png"
              alt="Green cap"
            />
            <img
              className={`${styles.showcaseItem} ${styles.showcaseMug}`}
              src="/mugs/blue.png"
              alt="Blue mug"
            />
          </div>
        </div>
      </section>

      <section className={styles.products}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>Choose what you want to customize</h2>
        </div>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              href={category.href}
              className={styles.card}
              key={category.href}
            >
              <div className={styles.cardImage}>
                <img src={category.image} alt={category.title} />
              </div>
              <div>
                <h3>{category.title}</h3>
              </div>
              <span>Explore</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.simpleInfo}>
        <div>
          <h2>Made for simple custom orders</h2>
          <p>
            Choose a product, add your design, and keep everything ready in
            your cart before checkout.
          </p>
        </div>

        <div className={styles.infoList}>
          <span>Front and back design options</span>
          <span>Preview before adding to cart</span>
          <span>Products for teams, gifts, and everyday wear</span>
        </div>

      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerColumn}>
            <h3>About Us</h3>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/profile">Profile</Link>
          </div>

          <div className={styles.footerColumn}>
            <h3>Services</h3>
            <Link href="/customize">Customization</Link>
            <Link href="/tshirts">Products</Link>
            <Link href="/cart">Cart</Link>
          </div>

          <div className={styles.footerColumn}>
            <h3>Privacy</h3>
            <Link href="/about">Privacy Policy</Link>
            <Link href="/contact">FAQ</Link>
            <Link href="/contact">Terms and Conditions</Link>
          </div>

          <div className={styles.footerContact}>
            <div className={styles.socialLinks} aria-label="Social links">
              <a href="#" aria-label="Facebook">
                <img src="/assets/facebook.png" alt="" />
              </a>
              <a href="#" aria-label="Instagram">
                <img src="/assets/instagram.png" alt="" />
              </a>
              <a href="#" aria-label="YouTube">
                <img src="/assets/youtube.png" alt="" />
              </a>
            </div>
            <h3>Contact Information</h3>
            <p>
              XYZ Building, ABC Street<br />
              Example Area, Bangalore<br />
              Karnataka, India - 00000
            </p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          Copyright ©2026 All rights reserved.
        </div>
      </footer>
    </div>
  );
}
