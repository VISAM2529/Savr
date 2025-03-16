import mongoose from "mongoose";

const TrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Add userId
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Add productId
  productUrl: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  currentPrice: { type: Number, default: null },
  lastChecked: { type: Date, default: null },
});

export default mongoose.models.Tracking || mongoose.model("Tracking", TrackingSchema);
