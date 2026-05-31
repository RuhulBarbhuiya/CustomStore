import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { findCategoryProduct } from "@/app/data/categoryProducts";
import { getAllLocalProducts, getLocalProductsByCategory } from "@/app/data/localProducts";
import { normalizeProductImages } from "@/lib/imagePaths";

function buildProductQuery({ category, isCustomizable } = {}) {
  const query = {};

  if (category) {
    query.category = category;
  }

  if (isCustomizable === true) {
    query.isCustomizable = true;
  }

  if (isCustomizable === false) {
    query.$or = [
      { isCustomizable: false },
      { isCustomizable: { $exists: false } },
    ];
  }

  return query;
}

function serializeProduct(product) {
  if (!product) return null;

  const plainProduct =
    typeof product.toObject === "function" ? product.toObject() : product;

  return normalizeProductImages({
    ...plainProduct,
    _id: String(plainProduct._id || plainProduct.id),
    isCustomizable: Boolean(plainProduct.isCustomizable),
  });
}

export async function getProducts(filters) {
  await connectDB();

  const products = await Product.find(buildProductQuery(filters)).lean();

  return products.map(serializeProduct);
}

export async function getProductById(id) {
  if (!mongoose.isValidObjectId(id)) {
    const localProduct = findCategoryProduct(id);
    return localProduct ? serializeProduct(localProduct) : null;
  }

  await connectDB();

  const product = await Product.findById(id).lean();

  return serializeProduct(product);
}

export function parseCustomizableFilter(value) {
  if (value === "true") return true;
  if (value === "false") return false;

  return undefined;
}

export function mergeProductLists(localProducts, dbProducts) {
  const productMap = new Map();

  [...localProducts, ...dbProducts].forEach((product) => {
    const key = String(product._id || product.id);
    productMap.set(key, product);
  });

  return Array.from(productMap.values());
}

export function getMergedProducts({ category, isCustomizable } = {}, dbProducts = []) {
  const localProducts = category
    ? getLocalProductsByCategory(category)
    : getAllLocalProducts();
  const filteredLocalProducts =
    typeof isCustomizable === "boolean"
      ? localProducts.filter(
          (product) => Boolean(product.isCustomizable) === isCustomizable
        )
      : localProducts;

  return mergeProductLists(filteredLocalProducts, dbProducts);
}
