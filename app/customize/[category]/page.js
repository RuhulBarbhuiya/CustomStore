import { notFound, redirect } from "next/navigation";
import CustomizeClient from "../product/[id]/CustomizeClient";
import {
  findCustomizableCategory,
  customizableCategoryLinks,
} from "@/app/data/categoryProducts";
import { getProducts, getMergedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return customizableCategoryLinks.map((category) => ({
    category: category.slug,
  }));
}

export default async function CustomizeCategoryPage({ params }) {
  const { category } = await params;
  const categoryData = findCustomizableCategory(category);

  if (!categoryData) {
    notFound();
  }

  const dbProducts = await getProducts({
    category: categoryData.slug,
    isCustomizable: true,
  });
  const mergedProducts = getMergedProducts(
    { category: categoryData.slug, isCustomizable: true },
    dbProducts
  );
  const mergedCategoryData = {
    ...categoryData,
    products: mergedProducts,
  };

  const firstProduct = mergedCategoryData.products?.[0];

  if (firstProduct) {
    redirect(`/customize/product/${firstProduct._id || firstProduct.id}`);
  }

  let categoryStr = category.replace(/s$/, ""); 
  if (category === "full-sleeves") categoryStr = "full-sleeve";

  const defaultProduct = {
    id: `default-${categoryStr}`,
    name: mergedCategoryData.title,
    price: categoryStr === "hoodie" ? 1200 : categoryStr === "tshirt" ? 500 : 300,
    category: categoryStr,
    isCustomizable: true,
    image:
      categoryStr === "cap"
        ? "/caps/set5/white.png"
        : categoryStr === "pant"
          ? "/homepage/hero.png"
        : categoryStr === "hoodie"
          ? "/hoodies/set2/whitefront.png"
        : categoryStr === "full-sleeve"
          ? "/fulltshirt/set1/whitefront.png"
          : "/tshirts/set3/whitefront.png",
    description: mergedCategoryData.description,
  };

  return <CustomizeClient product={defaultProduct} />;
}
