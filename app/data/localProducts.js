export const localProductsByCategory = {
  tshirt: [],
  hoodie: [],
  "full-sleeve": [],
  pant: [],
  mug: [],
  cap: [],
};

export function getAllLocalProducts() {
  return Object.values(localProductsByCategory).flat();
}

export function getLocalProductsByCategory(category) {
  return localProductsByCategory[category] || [];
}

export function findLocalProduct(productId) {
  return getAllLocalProducts().find((product) => product.id === productId) || null;
}

export function findCustomizableLocalProduct(productId) {
  return (
    getAllLocalProducts().find(
      (product) => product.id === productId && product.isCustomizable
    ) || null
  );
}
