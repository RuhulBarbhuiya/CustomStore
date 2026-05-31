import { notFound } from "next/navigation";
import CustomizeClient from "./CustomizeClient";
import { findCustomizableProduct } from "@/app/data/categoryProducts";
import { getProductById } from "@/lib/products";

export default async function CustomizeProductPage({ params }) {
  const { id } = await params;
  const localProduct = findCustomizableProduct(id);

  if (localProduct) {
    return <CustomizeClient product={localProduct} />;
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <CustomizeClient product={product} />;
}
