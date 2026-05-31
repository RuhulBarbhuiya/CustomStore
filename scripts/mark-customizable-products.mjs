import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const envFile = fs.readFileSync(filePath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    process.env[key] = process.env[key] || value;
  }
}

loadEnvFile(path.join(process.cwd(), ".env.local"));

const category = process.argv[2] || "tshirt";
const shouldBeCustomizable = process.argv[3] !== "false";

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI in .env.local");
  process.exit(1);
}

const productSchema = new mongoose.Schema(
  {
    category: String,
    isCustomizable: {
      type: Boolean,
      default: false,
    },
  },
  { strict: false }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

await mongoose.connect(process.env.MONGODB_URI);

const result = await Product.updateMany(
  { category },
  { $set: { isCustomizable: shouldBeCustomizable } }
);

await mongoose.disconnect();

console.log(
  `Updated ${result.modifiedCount} of ${result.matchedCount} ${category} products.`
);
