import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  name: String,
  currentPrice: Number,
  previousPrice: Number,
  lastChecked: Date,
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
