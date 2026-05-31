import { getProductById } from "@/lib/products";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  const { id } = await params;
  const product = await getProductById(id);

  return Response.json(product);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: "Invalid ID for updating" }, { status: 400 });
  }

  await connectDB();
  const data = await req.json();

  const product = await Product.findByIdAndUpdate(
    id,
    { ...data, isCustomizable: Boolean(data.isCustomizable) },
    { returnDocument: "after" }
  );

  return Response.json(product);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return Response.json({ error: "Invalid ID for deletion" }, { status: 400 });
  }

  await connectDB();
  await Product.findByIdAndDelete(id);

  return Response.json({ success: true });
}
