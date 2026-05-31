import CategoryPage from "@/app/components/CategoryPage";
import { categoryProducts } from "@/app/data/categoryProducts";

export default function TshirtsPage() {
  return <CategoryPage category={categoryProducts.tshirts} detailBasePath="/products" />;
}
