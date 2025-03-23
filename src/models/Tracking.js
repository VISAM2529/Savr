import mongoose from "mongoose";

const TrackingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, // Reference to the user tracking the product

  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  }, // Reference to the tracked product

  productUrl: { 
    type: String, 
    required: true 
  }, // URL of the tracked product

  targetPrice: { 
    type: Number, 
    required: true 
  }, // Price at which user wants to be notified

  currentPrice: { 
    type: Number, 
    default: null 
  }, // Most recent fetched price

  priceHistory: [
    {
      price: { type: Number },
      date: { type: Date, default: Date.now }
    }
  ], // Array to store price changes over time

  lastChecked: { 
    type: Date, 
    default: Date.now 
  }, // When the price was last updated
});

export default mongoose.models.Tracking || mongoose.model("Tracking", TrackingSchema);
