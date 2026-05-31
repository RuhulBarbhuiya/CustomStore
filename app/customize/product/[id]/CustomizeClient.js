"use client";

import * as fabric from "fabric";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { getUserSnapshot, subscribeToUser } from "@/lib/user";
import { designs } from "@/app/data/designs";
import styles from "./customize.module.css";

const fallbackColors = {
  cap: [
    { name: "White", value: "white", swatch: "#f8fafc", image: "/caps/set5/white.png" },
    { name: "Black", value: "black", swatch: "#111111", image: "/caps/set5/black.png" },
    { name: "Red", value: "red", swatch: "#dc2626", image: "/caps/set5/red.png" },
    { name: "Navy Blue", value: "navy-blue", swatch: "#1e3a8a", image: "/caps/set5/navy blue.png" },
    { name: "Maroon", value: "maroon", swatch: "#7f1d1d", image: "/caps/set5/maroon.png" },
    { name: "Yellow", value: "yellow", swatch: "#facc15", image: "/caps/set5/yellow.png" },
  ],
  hoodie: [
    { name: "White", value: "white", swatch: "#f8fafc", frontImage: "/hoodies/set2/whitefront.png", backImage: "/hoodies/set2/whiteback.png" },
    { name: "Black", value: "black", swatch: "#111111", frontImage: "/hoodies/set2/blackfront.png", backImage: "/hoodies/set2/blackback.png" },
    { name: "Red", value: "red", swatch: "#dc2626", frontImage: "/hoodies/set2/redfront.png", backImage: "/hoodies/set2/redback.png" },
    { name: "Navy Blue", value: "navy-blue", swatch: "#1e3a8a", frontImage: "/hoodies/set2/navybluefront.png", backImage: "/hoodies/set2/navyblueback.png" },
    { name: "Maroon", value: "maroon", swatch: "#7f1d1d", frontImage: "/hoodies/set2/maroonfront.png", backImage: "/hoodies/set2/maroonback.png" },
    { name: "Yellow", value: "yellow", swatch: "#facc15", frontImage: "/hoodies/set2/yellowfront.png", backImage: "/hoodies/set2/yellowback.png" },
  ],
  mug: [
    { name: "White", value: "white", swatch: "#f8fafc", image: "/mugs/white.png" },
    { name: "Black", value: "black", swatch: "#111111", image: "/mugs/black.png" },
    { name: "Blue", value: "blue", swatch: "#2563eb", image: "/mugs/blue.png" },
    { name: "Green", value: "green", swatch: "#16a34a", image: "/mugs/green.png" },
    { name: "Maroon", value: "maroon", swatch: "#7f1d1d", image: "/mugs/maroon.png" },
    { name: "Red", value: "red", swatch: "#dc2626", image: "/mugs/red.png" },
    { name: "Yellow", value: "yellow", swatch: "#facc15", image: "/mugs/yellow.png" },
  ],
  tshirt: [
    { name: "White", value: "white", swatch: "#f8fafc", frontImage: "/tshirts/set3/whitefront.png", backImage: "/tshirts/set3/whiteback.png" },
    { name: "Black", value: "black", swatch: "#111111", frontImage: "/tshirts/set3/blackfront.png", backImage: "/tshirts/set3/blackback.png" },
    { name: "Red", value: "red", swatch: "#dc2626", frontImage: "/tshirts/set3/redfront.png", backImage: "/tshirts/set3/redback.png" },
    { name: "Blue", value: "blue", swatch: "#1d4ed8", frontImage: "/tshirts/set3/bluefront.png", backImage: "/tshirts/set3/blueback.png" },
    { name: "Maroon", value: "maroon", swatch: "#7f1d1d", frontImage: "/tshirts/set3/maroonfront.png", backImage: "/tshirts/set3/maroonback.png" },
    { name: "Yellow", value: "yellow", swatch: "#facc15", frontImage: "/tshirts/set3/yellowfront.png", backImage: "/tshirts/set3/yellowback.png" },
  ],
  "full-sleeve": [
    { name: "White", value: "white", swatch: "#f8fafc", frontImage: "/fulltshirt/set1/whitefront.png", backImage: "/fulltshirt/set1/whiteback.png" },
    { name: "Black", value: "black", swatch: "#111111", frontImage: "/fulltshirt/set1/blackfront.png", backImage: "/fulltshirt/set1/blackback.png" },
    { name: "Red", value: "red", swatch: "#dc2626", frontImage: "/fulltshirt/set1/redfront.png", backImage: "/fulltshirt/set1/redback.png" },
    { name: "Navy Blue", value: "navy-blue", swatch: "#1e3a8a", frontImage: "/fulltshirt/set1/navybluefront.png", backImage: "/fulltshirt/set1/navyblueback.png" },
    { name: "Maroon", value: "maroon", swatch: "#7f1d1d", frontImage: "/fulltshirt/set1/maroonfront.png", backImage: "/fulltshirt/set1/maroonback.png" },
  ],
};

const textColors = [
  { name: "Black", value: "#111111" },
  { name: "White", value: "#ffffff" },
  { name: "Red", value: "#dc2626" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Yellow", value: "#facc15" },
  { name: "Pink", value: "#db2777" },
  { name: "Gold", value: "#d97706" },
];

function getProductKind(product) {
  if (product.category === "cap" || product.image?.startsWith("/caps/")) {
    return "cap";
  }

  if (product.category === "hoodie") return "hoodie";
  if (product.category === "mug") return "mug";
  if (product.category === "full-sleeve") return "full-sleeve";
  if (product.category === "pant") return "pant";

  return "tshirt";
}

function getProductLabel(productKind) {
  const labels = {
    cap: "Cap",
    "full-sleeve": "Full sleeve",
    hoodie: "Hoodie",
    mug: "Mug",
    pant: "Pant",
    tshirt: "T-shirt",
  };

  return labels[productKind] || "Product";
}

function getColorOptions(product, productKind) {
  if (Array.isArray(product.colorOptions) && product.colorOptions.length > 0) {
    const availableColors = product.colorOptions
      .filter((color) => color?.image || color?.frontImage || color?.backImage)
      .map((color) => ({
        ...color,
        image: color.image || color.frontImage || color.backImage || product.image,
        frontImage: color.frontImage || color.image || product.image,
        backImage: color.backImage || color.image || color.frontImage || product.image,
      }));

    if (availableColors.length > 0) {
      return availableColors;
    }
  }

  if (fallbackColors[productKind]) {
    return fallbackColors[productKind].map((color) => ({
      ...color,
      image: color.image || color.frontImage,
      frontImage: color.frontImage || color.image,
      backImage: color.backImage || color.image || color.frontImage,
    }));
  }

  return [
    {
      name: "Default",
      value: "default",
      swatch: "#e5e5e5",
      image: product.image,
      frontImage: product.image,
      backImage: product.image,
    },
  ];
}

function getInitialColor(productImage, colors) {
  return (
    colors.find((color) => color.value === "white") ||
    colors.find(
      (color) =>
        color.image === productImage ||
        color.frontImage === productImage ||
        color.backImage === productImage
    ) ||
    colors[0]
  );
}

function getRecommendedDesigns(productCategory) {
  // Filter designs that include the selected product category.
  // Then sort by priority so better recommendations appear first.
  return designs
    .filter((design) => design.categories.includes(productCategory))
    .sort((firstDesign, secondDesign) => firstDesign.priority - secondDesign.priority);
}

export default function CustomizeClient({ product }) {
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    () => "null"
  );
  const productKind = useMemo(() => getProductKind(product), [product]);
  const supportsBackSide = productKind !== "mug";
  const colorOptions = useMemo(
    () => getColorOptions(product, productKind),
    [product, productKind]
  );
  const productLabel = getProductLabel(productKind);
  const initialColor = useMemo(
    () => getInitialColor(product.image, colorOptions),
    [colorOptions, product.image]
  );
  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const uploadInputRef = useRef(null);
  const fabricCanvasesRef = useRef({ front: null, back: null });
  const [customText, setCustomText] = useState("");
  const [selectedTextColor, setSelectedTextColor] = useState(textColors[0].value);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [activeSide, setActiveSide] = useState("front");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadMessageType, setUploadMessageType] = useState("success");
  const [isDraggingDesign, setIsDraggingDesign] = useState(false);
  const cartMessageTimerRef = useRef(null);
  const recommendedDesigns = useMemo(
    () => getRecommendedDesigns(productKind),
    [productKind]
  );

  useEffect(() => {
    setSelectedColor(initialColor);
  }, [initialColor]);

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

  useEffect(() => {
    if (!supportsBackSide && activeSide === "back") {
      setActiveSide("front");
    }
  }, [activeSide, supportsBackSide]);

  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  const requireSignIn = () => {
    if (user) return true;

    setCartMessage("Please sign in to add customized products to cart or checkout.");
    router.push("/login");
    return false;
  };

  useEffect(() => {
    const createCanvas = (element) => {
      const canvas = new fabric.Canvas(element, {
        width: 220,
        height: 240,
        preserveObjectStacking: true,
        selection: true,
      });

      canvas.wrapperEl.style.margin = "0 auto";
      return canvas;
    };

    if (!frontCanvasRef.current || (supportsBackSide && !backCanvasRef.current)) return;

    const frontCanvas = createCanvas(frontCanvasRef.current);
    const backCanvas = supportsBackSide ? createCanvas(backCanvasRef.current) : null;
    fabricCanvasesRef.current = {
      front: frontCanvas,
      ...(backCanvas ? { back: backCanvas } : {}),
    };

    const syncSelectedTextColor = (event) => {
      const selectedObject = event?.selected?.[0] || event?.target;

      if (selectedObject?.type === "text" || selectedObject?.type === "i-text") {
        setSelectedTextColor(selectedObject.fill || textColors[0].value);
      }
    };

    Object.values(fabricCanvasesRef.current).forEach((canvas) => {
      canvas.on("selection:created", syncSelectedTextColor);
      canvas.on("selection:updated", syncSelectedTextColor);
    });

    return () => {
      const canvases = Object.values(fabricCanvasesRef.current);
      fabricCanvasesRef.current = { front: null, back: null };
      canvases.forEach((canvas) => {
        canvas.off("selection:created", syncSelectedTextColor);
        canvas.off("selection:updated", syncSelectedTextColor);
        canvas.dispose();
      });
    };
  }, [supportsBackSide]);

  useEffect(() => {
    const canvasEntries = Object.entries(fabricCanvasesRef.current).filter(
      ([, canvas]) => Boolean(canvas)
    );
    if (canvasEntries.length === 0) return;

    let isActive = true;

    Promise.all(
      canvasEntries.map(([side]) =>
        fabric.Image.fromURL(
          side === "back"
            ? selectedColor.backImage || selectedColor.image
            : selectedColor.frontImage || selectedColor.image
        )
      )
    ).then((shirts) => {
      if (!isActive) return;

      shirts.forEach((shirt, index) => {
        const canvas = canvasEntries[index][1];
        const scale = Math.min(
          canvas.getWidth() / shirt.width,
          canvas.getHeight() / shirt.height
        );

        shirt.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });

        canvas.backgroundImage = shirt;
        canvas.renderAll();
      });
    });

    return () => {
      isActive = false;
    };
  }, [selectedColor]);

  const addImageToCanvas = (imageUrl) => {
    const canvas = fabricCanvasesRef.current[activeSide];

    if (!canvas || !imageUrl) return;

    const loadOptions = imageUrl.startsWith("data:")
      ? undefined
      : { crossOrigin: "anonymous" };

    fabric.Image.fromURL(imageUrl, loadOptions).then((image) => {
      const scale = Math.min(120 / image.width, 120 / image.height, 1);

      image.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
      });

      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    });
  };

  const addText = () => {
    const canvas = fabricCanvasesRef.current[activeSide];
    const textValue = customText.trim();

    if (!canvas || !textValue) return;

    const text = new fabric.Text(textValue, {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      originX: "center",
      originY: "center",
      fill: selectedTextColor,
      fontSize: 26,
      fontFamily: "Arial",
      editable: true,
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setCustomText("");
  };

  const changeTextColor = (colorValue) => {
    const canvas = fabricCanvasesRef.current[activeSide];
    const selectedObject = canvas?.getActiveObject();

    setSelectedTextColor(colorValue);

    if (
      selectedObject &&
      (selectedObject.type === "text" || selectedObject.type === "i-text")
    ) {
      selectedObject.set("fill", colorValue);
      canvas.renderAll();
    }
  };

  const deleteSelectedObject = useCallback(() => {
    const canvas = fabricCanvasesRef.current[activeSide];
    const selectedObject = canvas?.getActiveObject();

    if (!canvas || !selectedObject) return;

    if (selectedObject.type === "activeSelection") {
      selectedObject.getObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
    } else {
      canvas.remove(selectedObject);
    }

    canvas.requestRenderAll();
  }, [activeSide]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target?.tagName?.toLowerCase();
      const isTyping =
        targetTag === "input" ||
        targetTag === "textarea" ||
        event.target?.isContentEditable;

      if (isTyping || (event.key !== "Delete" && event.key !== "Backspace")) {
        return;
      }

      deleteSelectedObject();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteSelectedObject]);

  const uploadDesignFile = (file) => {
    setUploadMessage("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadMessageType("error");
      setUploadMessage("Please upload an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      addImageToCanvas(reader.result);
      setUploadMessageType("success");
      setUploadMessage(`${file.name} added to ${activeSide}.`);
    };

    reader.readAsDataURL(file);
  };

  const uploadImage = (event) => {
    uploadDesignFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDesignDrop = (event) => {
    event.preventDefault();
    setIsDraggingDesign(false);
    uploadDesignFile(event.dataTransfer.files?.[0]);
  };

  const openUploadPicker = () => {
    uploadInputRef.current?.click();
  };

  const handleUploadKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openUploadPicker();
    }
  };

  const buildCustomizedCartItem = () => {
    const frontCanvas = fabricCanvasesRef.current.front;
    const backCanvas = fabricCanvasesRef.current.back;

    return {
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      image: selectedColor.image,
      category: productKind,
      selectedColor: selectedColor.value,
      size: productKind === "cap" || productKind === "mug" ? "Free Size" : selectedSize,
      frontDesign: frontCanvas?.toDataURL(),
      backDesign: supportsBackSide ? backCanvas?.toDataURL() : undefined,
      frontDesignJSON: frontCanvas?.toJSON(),
      backDesignJSON: supportsBackSide ? backCanvas?.toJSON() : undefined,
      quantity,
      customized: true,
    };
  };

  const handleAddToCart = () => {
    if (!requireSignIn()) return;
    addToCart(buildCustomizedCartItem());
    showCartMessage();
  };

  const handleCheckout = () => {
    if (!requireSignIn()) return;
    addToCart(buildCustomizedCartItem());
    router.push("/checkout");
  };

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <h2>Product Details</h2>
        <p>HOME | {product.name}</p>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.left}>
          {supportsBackSide && (
            <div className={styles.sideTabs}>
              <button
                type="button"
                className={activeSide === "front" ? styles.activeSide : ""}
                onClick={() => setActiveSide("front")}
              >
                Front
              </button>
              <button
                type="button"
                className={activeSide === "back" ? styles.activeSide : ""}
                onClick={() => setActiveSide("back")}
              >
                Back
              </button>
            </div>
          )}

          <div className={styles.imageBox}>
            <div style={{ display: activeSide === "front" ? "block" : "none" }}>
              <canvas
                ref={frontCanvasRef}
                aria-label={`Front ${selectedColor.name} ${product.name}`}
                style={{ filter: selectedColor.filter || "none" }}
              />
            </div>
            {supportsBackSide && (
              <div style={{ display: activeSide === "back" ? "block" : "none" }}>
                <canvas
                  ref={backCanvasRef}
                  aria-label={`Back ${selectedColor.name} ${product.name}`}
                  style={{ filter: selectedColor.filter || "none" }}
                />
              </div>
            )}
          </div>

          <h3 className={styles.productName}>{product.name}</h3>

          <div className={styles.size}>
            <span>Size:</span>
              {productKind === "cap" || productKind === "mug" ? (
                <button>Free Size</button>
              ) : (
              <>
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={selectedSize === size ? styles.selectedSize : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </>
            )}
          </div>

          <div className={styles.quantity}>
            <span>Quantity:</span>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Number(event.target.value) || 1))
              }
            />
          </div>

          <div className={styles.purchaseActions}>
            <button className={styles.cartBtn} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout
            </button>
          </div>
          {cartMessage && (
            <p className={styles.cartMessage}>{cartMessage}</p>
          )}
        </div>

        <div className={styles.right}>
          <h3>Select Color</h3>
          <div className={styles.colors}>
            {colorOptions.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`${styles.color} ${
                  selectedColor.value === color.value ? styles.selectedColor : ""
                }`}
                style={{ background: color.swatch }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color.name} ${productLabel}`}
              />
            ))}
          </div>

          <h3>Add Text</h3>
          <div className={styles.textBox}>
            <input
              placeholder="Type here..."
              value={customText}
              onChange={(event) => setCustomText(event.target.value)}
            />
            <button type="button" onClick={addText}>
              Add Text
            </button>
          </div>

          <div className={styles.textColors}>
            {textColors.map((color) => (
              <button
                key={color.value}
                type="button"
                className={`${styles.textColor} ${
                  selectedTextColor === color.value ? styles.selectedTextColor : ""
                }`}
                style={{ background: color.value }}
                onClick={() => changeTextColor(color.value)}
                aria-label={`${color.name} text`}
              />
            ))}
          </div>

          <h3>Upload Design</h3>
          <div
            className={`${styles.uploadDropzone} ${
              isDraggingDesign ? styles.uploadDropzoneActive : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={openUploadPicker}
            onKeyDown={handleUploadKeyDown}
            onDragEnter={() => setIsDraggingDesign(true)}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDraggingDesign(true);
            }}
            onDragLeave={() => setIsDraggingDesign(false)}
            onDrop={handleDesignDrop}
          >
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className={styles.uploadInput}
              onChange={uploadImage}
            />
            <span className={styles.uploadIcon} aria-hidden="true">
              +
            </span>
            <strong>Drop your design here</strong>
            <span>or browse image files</span>
          </div>
          {uploadMessage && (
            <p
              className={`${styles.uploadMessage} ${
                uploadMessageType === "error" ? styles.uploadError : styles.uploadSuccess
              }`}
            >
              {uploadMessage}
            </p>
          )}

          <button
            type="button"
            className={styles.deleteBtn}
            onClick={deleteSelectedObject}
          >
            Delete Selected
          </button>

          <h3>Recommended Designs</h3>
          <div className={styles.assetGrid}>
            {/* Render the filtered recommendations with map(). */}
            {recommendedDesigns.map((design) => (
              <button
                key={design.id || design._id}
                type="button"
                className={styles.assetCard}
                onClick={() => addImageToCanvas(design.image)}
                aria-label={`Use ${design.name}`}
              >
                <img src={design.image} alt={design.name} />
                <span>{design.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.description}>
        <h3>Description</h3>
        <p>
          High-quality {productLabel.toLowerCase()} with durable print and
          comfortable fit. Perfect for daily wear and customization.
        </p>
      </div>
    </div>
  );
}
