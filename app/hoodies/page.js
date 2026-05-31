import CategoryPage from "@/app/components/CategoryPage";
import { categoryProducts } from "@/app/data/categoryProducts";

export default function HoodiesPage() {
  return <CategoryPage category={categoryProducts.hoodies} detailBasePath="/products" />;
}
