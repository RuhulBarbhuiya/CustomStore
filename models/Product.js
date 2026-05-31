import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  backImage: String,
  description: String,
  category: {
    type: String,
    trim: true,
    index: true,
  },
  isCustomizable: {
    type: Boolean,
    default: false,
    index: true,
  },
  colorOptions: [
    {
      name: String,
      value: String,
      image: String,
      frontImage: String,
      backImage: String,
      swatch: String,
    },
  ],
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
