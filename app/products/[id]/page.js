"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./product.module.css";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import { normalizeImagePath } from "@/lib/imagePaths";
import { getUserSnapshot, subscribeToUser } from "@/lib/user";

function inferBackImage(product) {
  const image = product?.image || "";
  const category = product?.category;
  const supportsBackView = ["tshirt", "hoodie", "full-sleeve"].includes(category);

  if (!supportsBackView) return "";
  if (product.backImage) return product.backImage;

  const colorBackImage = product.colorOptions?.find(
    (color) => color?.backImage
  )?.backImage;

  if (colorBackImage) return colorBackImage;
  if (!/front/i.test(image)) return "";

  return image.replace(/front/gi, (match) =>
    match === match.toUpperCase() ? "BACK" : "back"
  );
}

function canCustomizeProduct(product) {
  return (
    product?.isCustomizable ||
    ["tshirt", "hoodie", "full-sleeve", "cap", "mug"].includes(product?.category)
  );
}

const fallbackColorOptions = {
  mug: [
    { name: "White", value: "white", swatch: "#f8fafc", image: "/mugs/white.png" },
    { name: "Black", value: "black", swatch: "#111111", image: "/mugs/black.png" },
    { name: "Blue", value: "blue", swatch: "#2563eb", image: "/mugs/blue.png" },
    { name: "Green", value: "green", swatch: "#16a34a", image: "/mugs/green.png" },
    { name: "Maroon", value: "maroon", swatch: "#7f1d1d", image: "/mugs/maroon.png" },
    { name: "Red", value: "red", swatch: "#dc2626", image: "/mugs/red.png" },
    { name: "Yellow", value: "yellow", swatch: "#facc15", image: "/mugs/yellow.png" },
  ],
};

function getColorOptions(product) {
  if (Array.isArray(product?.colorOptions) && product.colorOptions.length > 0) {
    const availableColors = product.colorOptions
      .filter((color) => color?.image || color?.frontImage || color?.backImage)
      .map((color) => ({
        ...color,
        image: normalizeImagePath(
          color.image || color.frontImage || color.backImage || product.image
        ),
      }));

    if (availableColors.length > 0) {
      return availableColors;
    }
  }

  return (fallbackColorOptions[product?.category] || []).map((color) => ({
    ...color,
    image: normalizeImagePath(color.image),
  }));
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    () => "null"
  );

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeView, setActiveView] = useState("front");
  const [selectedColor, setSelectedColor] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const cartMessageTimerRef = useRef(null);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [params?.id]);

  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  useEffect(() => {
    return () => {
      if (cartMessageTimerRef.current) {
        clearTimeout(cartMessageTimerRef.current);
      }
    };
  }, []);

  const showCartMessage = () => {
    setCartMessage("Product added to cart.");

    if (cartMessageTimerRef.current) {
      clearTimeout(cartMessageTimerRef.current);
    }

    cartMessageTimerRef.current = setTimeout(() => {
      setCartMessage("");
    }, 2500);
  };

  if (!product) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p>Loading your product...</p>
      </div>
    );
  }

  const productId = product._id || product.id;
  const colorOptions = getColorOptions(product);
  const activeColor =
    selectedColor ||
    colorOptions.find((color) => color.image === normalizeImagePath(product.image)) ||
    colorOptions.find((color) => color.value === "white") ||
    colorOptions[0] ||
    null;
  const frontImage = activeColor?.image || normalizeImagePath(product.image);
  const backImage = normalizeImagePath(inferBackImage(product));
  const productImages = [
    { label: "Front", image: frontImage },
    ...(backImage && backImage !== frontImage
      ? [{ label: "Back", image: backImage }]
      : []),
  ];
  const activeImage =
    productImages.find((view) => view.label.toLowerCase() === activeView)
      ?.image || frontImage;
  const showCustomize = canCustomizeProduct(product);

  const requireSignIn = () => {
    if (user) return true;

    alert("Please sign in to add products to cart or checkout.");
    router.push("/login");
    return false;
  };

  const buildCartItem = () => ({
      id: productId,
      name: product.name,
      price: product.price,
      image: frontImage,
      backImage: backImage || undefined,
      selectedColor: activeColor?.value,
      size: product.category === "mug" ? "Free Size" : selectedSize
  });

  const handleAddToCart = () => {
    if (!requireSignIn()) return;
    addToCart(buildCartItem());
    showCartMessage();
  };

  const handleBuyNow = () => {
    if (!requireSignIn()) return;
    addToCart(buildCartItem());
    router.push("/checkout");
  };

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.hero}>
        <h1>{product.name}</h1>
        <p>HOME | PRODUCTS | {product.name.toUpperCase()}</p>
      </section>

      <section className={styles.container}>
        <div className={styles.imageColumn}>
          <div className={styles.imageWrapper}>
            <img src={activeImage} alt={`${product.name} ${activeView}`} />
          </div>
          {productImages.length > 1 && (
            <div className={styles.viewOptions}>
              {productImages.map((view) => (
                <button
                  type="button"
                  key={view.label}
                  className={`${styles.viewButton} ${
                    activeView === view.label.toLowerCase()
                      ? styles.selectedView
                      : ""
                  }`}
                  onClick={() => setActiveView(view.label.toLowerCase())}
                >
                  <img src={view.image} alt={`${product.name} ${view.label}`} />
                  <span>{view.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.detailsColumn}>
          <div className={styles.headerGroup}>
            <h2 className={styles.title}>{product.name}</h2>
            <p className={styles.price}>Rs {product.price}</p>
            <p className={styles.tag}>Premium Quality</p>
          </div>

          <div className={styles.sizeSection}>
            <span className={styles.sizeLabel}>Select Size:</span>
            <div className={styles.sizeOptions}>
              {product.category === "mug" ? (
                <button className={`${styles.sizeButton} ${styles.freeSizeButton} ${styles.selectedSize}`}>
                  Free Size
                </button>
              ) : (
                ['S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.selectedSize : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))
              )}
            </div>
          </div>

          {colorOptions.length > 0 && (
            <div className={styles.colorSection}>
              <span className={styles.sizeLabel}>Select Color:</span>
              <div className={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <button
                    type="button"
                    key={color.value}
                    className={`${styles.colorButton} ${
                      activeColor?.value === color.value ? styles.selectedColor : ""
                    }`}
                    style={{ background: color.swatch || "#e5e7eb" }}
                    onClick={() => {
                      setSelectedColor(color);
                      setActiveView("front");
                    }}
                    aria-label={`Select ${color.name || color.value} color`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className={styles.actionsSection}>
            {showCustomize && (
              <div className={styles.customBox}>
                <h3>Make it Yours</h3>
                <p>Add text, images, logos, or artwork to the front and back.</p>
                <Link href={`/customize/product/${productId}`}>
                  <button className={styles.customiseBtn}>
                    Customise Design
                  </button>
                </Link>
              </div>
            )}

            <div className={styles.buyGroup}>
              <button className={styles.buyBtn} onClick={handleBuyNow}>Buy Now</button>
              <button className={styles.cartBtn} onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
            {cartMessage && (
              <p className={styles.cartMessage}>{cartMessage}</p>
            )}
          </div>

          <div className={styles.descriptionSection}>
            <h3>Product Information</h3>
            <p className={styles.descText}>
              {product.description || "Designed with care and high quality materials. Perfect for everyday use with uncompromised comfort and style."}
            </p>
            <ul className={styles.featuresList}>
              <li>High durability</li>
              <li>Premium materials</li>
              <li>Handcrafted finish</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
