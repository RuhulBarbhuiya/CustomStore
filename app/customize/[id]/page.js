import styles from "./customize.module.css";

export default async function Customize({ params }) {
  const { id } = params;

  // ✅ Fetch from API instead of local data
  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <h1>Not found</h1>;
  }

  const product = await res.json();

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <h2>Product Details</h2>
        <p>HOME | {product.name}</p>
      </div>

      <div className={styles.wrapper}>
        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.imageBox}>
            <img src={product.image} alt={product.name} />
          </div>

          <h3 className={styles.productName}>{product.name}</h3>

          <div className={styles.size}>
            <span>Size:</span>
            <button>S</button>
            <button>M</button>
            <button>L</button>
            <button>XL</button>
          </div>

          <button className={styles.cartBtn}>Add to Cart</button>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <h3>Select Color</h3>
          <div className={styles.colors}>
            <div className={styles.color} style={{ background: "black" }}></div>
            <div className={styles.color} style={{ background: "red" }}></div>
            <div className={styles.color} style={{ background: "green" }}></div>
            <div className={styles.color} style={{ background: "blue" }}></div>
            <div className={styles.color} style={{ background: "yellow" }}></div>
          </div>

          <h3>Add Text</h3>
          <div className={styles.textBox}>
            <input placeholder="Type here..." />
            <button>Add Text</button>
          </div>

          <h3>Upload Design</h3>
          <input type="file" className={styles.upload} />

          <h3>Recommended Designs</h3>
          <div className={styles.designs}>
            <img src="/homepage/design1.png" />
            <img src="/homepage/design2.png" />
          </div>
        </div>
      </div>

      <div className={styles.description}>
        <h3>Description</h3>
        <p>
          High-quality cotton T-shirt with durable print and comfortable fit.
          Perfect for daily wear and customization.
        </p>
      </div>
    </div>
  );
}