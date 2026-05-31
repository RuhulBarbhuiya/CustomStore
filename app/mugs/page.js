import CategoryPage from "@/app/components/CategoryPage";
import { categoryProducts } from "@/app/data/categoryProducts";

export default function MugsPage() {
  return <CategoryPage category={categoryProducts.mugs} detailBasePath="/products" />;
}
