import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  name: { type: String, required: true },  // Ensure name is required
  category: { type: String },  // Add category field for better organization
  description: { type: String }, // Optional description
  currentPrice: { type: Number, required: true }, // Make price required
  previousPrice: { type: Number, default: null }, // Default to null if first time
  lastChecked: { type: Date, default: Date.now }, // Auto-update when price is checked
  imageUrl: { type: String, required: true },  // Ensure images are always present
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
