import CategoryPage from "@/app/components/CategoryPage";
import { categoryProducts } from "@/app/data/categoryProducts";

export default function FullSleevesPage() {
  return <CategoryPage category={categoryProducts.fullSleeves} detailBasePath="/products" />;
}
