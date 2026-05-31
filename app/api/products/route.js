import { connectDB } from "@/lib/mongodb";
import { getProducts, getMergedProducts, parseCustomizableFilter } from "@/lib/products";
import Product from "@/models/Product";

// ADD PRODUCT (admin)
export async function POST(req) {
  await connectDB();

  const data = await req.json();

  const product = await Product.create({
    ...data,
    isCustomizable: Boolean(data.isCustomizable),
  });

  return Response.json(product);
}

// GET PRODUCTS (frontend)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const isCustomizable = parseCustomizableFilter(
    searchParams.get("isCustomizable")
  );
  const includeLocal = searchParams.get("includeLocal") === "true";

  const dbProducts = await getProducts({ category, isCustomizable });
  const products = includeLocal
    ? getMergedProducts({ category, isCustomizable }, dbProducts).map((product) => ({
        ...product,
        source: product.source || "database",
      }))
    : dbProducts;

  return Response.json(products);
}
