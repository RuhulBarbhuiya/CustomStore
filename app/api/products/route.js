import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// ADD PRODUCT (admin)
export async function POST(req) {
  await connectDB();

  const data = await req.json();

  const product = await Product.create(data);

  return Response.json(product);
}

// GET PRODUCTS (frontend)
export async function GET() {
  await connectDB();

  const products = await Product.find({ category: "tshirt" });

  return Response.json(products);
}