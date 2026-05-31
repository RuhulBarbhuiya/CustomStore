import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

async function check() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI. Add it to .env.local before running this script.");
  }

  await mongoose.connect(MONGODB_URI);
  const products = await Product.find({});
  console.log(JSON.stringify(products, null, 2));
  process.exit(0);
}

check().catch(console.error);
