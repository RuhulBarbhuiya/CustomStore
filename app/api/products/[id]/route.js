import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req, { params }) {
  await connectDB();

  const product = await Product.findById(params.id);

  return Response.json(product);
}