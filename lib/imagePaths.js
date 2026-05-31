export function normalizeImagePath(image) {
  if (!image || image.startsWith("http") || image.startsWith("data:")) {
    return image || "";
  }

  const prefixedImage = image.startsWith("/") ? image : `/${image}`;

  return prefixedImage
    .replace(/^\/fullshirt\//i, "/fulltshirt/")
    .replace(/\/set\s+(\d+)\//gi, "/set$1/")
    .replace(/\s+front(\.[a-z0-9]+)$/i, "front$1")
    .replace(/\s+back(\.[a-z0-9]+)$/i, "back$1");
}

export function normalizeProductImages(product) {
  if (!product) return product;

  return {
    ...product,
    image: normalizeImagePath(product.image),
    backImage: normalizeImagePath(product.backImage),
    colorOptions: Array.isArray(product.colorOptions)
      ? product.colorOptions.map((color) => ({
          ...color,
          image: normalizeImagePath(color.image),
          frontImage: normalizeImagePath(color.frontImage),
          backImage: normalizeImagePath(color.backImage),
        }))
      : product.colorOptions,
  };
}
