import CategoryPage from "@/app/components/CategoryPage";
import { categoryProducts } from "@/app/data/categoryProducts";

export default function CapsPage() {
  return <CategoryPage category={categoryProducts.caps} detailBasePath="/products" />;
}
