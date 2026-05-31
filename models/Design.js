import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      default: [],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    priority: {
      type: Number,
      default: 3,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Design || mongoose.model("Design", DesignSchema);
