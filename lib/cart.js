const CART_KEY = "cart";
const CART_CHANGE_EVENT = "cart:changed";

function canUseStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function normalizeCartItem(product) {
  const productId = String(product.productId || product._id || product.id);
  const hasCustomDesign =
    product.customized || product.frontDesign || product.backDesign;
  const customId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const baseId = product.id ? String(product.id) : productId;
  const id = hasCustomDesign
    ? `${productId}-${customId}`
    : product.size
      ? `${baseId}-${product.size}`
      : baseId;

  return {
    id,
    productId,
    name: product.name,
    price: Number(product.price) || 0,
    image: product.image,
    backImage: product.backImage,
    category: product.category,
    size: product.size,
    quantity: product.quantity || 1,
    selectedColor: product.selectedColor,
    frontDesign: product.frontDesign,
    backDesign: product.backDesign,
    frontDesignJSON: product.frontDesignJSON,
    backDesignJSON: product.backDesignJSON,
    customized: Boolean(hasCustomDesign),
  };
}

function notifyCartChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  }
}

export function getCart() {
  if (!canUseStorage()) return [];

  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function addToCart(product) {
  if (!canUseStorage()) return [];

  const item = normalizeCartItem(product);
  const cart = getCart();
  const existingItem = item.customized
    ? null
    : cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(item);
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartChange();
  return cart;
}

export function removeFromCart(productId) {
  if (!canUseStorage()) return [];

  const cart = getCart().filter((cartItem) => cartItem.id !== String(productId));
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  notifyCartChange();
  return cart;
}

export function clearCart() {
  if (!canUseStorage()) return [];

  localStorage.removeItem(CART_KEY);
  notifyCartChange();
  return [];
}

export function getCartSnapshot() {
  if (!canUseStorage()) return "[]";

  return localStorage.getItem(CART_KEY) || "[]";
}

export function subscribeToCart(callback) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(CART_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
