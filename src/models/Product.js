import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  name: String,
  currentPrice: Number,
  previousPrice: Number,
  lastChecked: Date,
  imageUrl: String,  // Add image field to schema
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;  // Ensure model is correctly exported
