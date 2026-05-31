"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import styles from "./category.module.css";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { normalizeImagePath } from "@/lib/imagePaths";
import { getUserSnapshot, subscribeToUser } from "@/lib/user";

export default function CategoryPage({
  category,
  detailBasePath,
  customizeBasePath,
  showAddToCart = true,
}) {
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    () => "null"
  );
  const [dbProducts, setDbProducts] = useState([]);
  const categorySlug = category?.slug || category?.products?.[0]?.category || "";
  const [loading, setLoading] = useState(Boolean(categorySlug));

  useEffect(() => {
    if (!categorySlug) {
      return;
    }

    const isCustomizable = !!customizeBasePath;

    fetch(`/api/products?category=${categorySlug}&isCustomizable=${isCustomizable}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDbProducts(data);
        }
      })
      .catch((err) => console.error("Error fetching db products:", err))
      .finally(() => setLoading(false));
  }, [categorySlug, customizeBasePath]);

  const getProductHref = (product) => {
    if (product.isCustomizable && customizeBasePath) {
      return `${customizeBasePath}/${product._id || product.id}`;
    }

    if (detailBasePath) {
      return `${detailBasePath}/${product._id || product.id}`;
    }

    return null;
  };
  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const handleAddToCart = (product) => {
    if (!user) {
      alert("Please sign in to add products to cart.");
      router.push("/login");
      return;
    }

    addToCart(product);
  };

  // Merge local mock products with whatever the admin has added to the database runtime
  const allProducts = [...category.products, ...dbProducts];

  return (
    <main>
      <section className={styles.hero}>
        <h1>{category.title}</h1>
        <p>{category.breadcrumb}</p>
      </section>

      <section className={styles.products}>
        <p className={styles.description}>{category.description}</p>

        {loading ? (
          <p style={{textAlign: "center", padding: "40px"}}>Loading products...</p>
        ) : allProducts.length > 0 ? (
          <div className={styles.grid}>
            {allProducts.map((product) => {
              const productHref = getProductHref(product);

              return (
                <article className={styles.card} key={product._id || product.id}>
                  {productHref ? (
                    <Link href={productHref} className={styles.cardLink}>
                      <img src={normalizeImagePath(product.image)} alt={product.name} />
                      <h2>{product.name}</h2>
                    </Link>
                  ) : (
                    <>
                      <img src={normalizeImagePath(product.image)} alt={product.name} />
                      <h2>{product.name}</h2>
                    </>
                  )}
                  <p>Rs {product.price}</p>
                  <div className={styles.actions}>
                    {showAddToCart && (
                      <button type="button" onClick={() => handleAddToCart(product)}>
                        Add to Cart
                      </button>
                    )}

                    {product.isCustomizable && customizeBasePath && (
                      <Link href={productHref} className={styles.customizeLink}>
                        Customise
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>No customizable products found</h2>
            <p>
              Add products with customization enabled from the admin panel, or
              mark existing products as customizable in the database.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
