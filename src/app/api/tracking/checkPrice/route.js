import { NextResponse } from "next/server";
import puppeteerScraper from "@/lib/puppeteerScraper";
import dbConnect from "@/lib/dbConnect";
import Tracking from "@/models/Tracking";

export async function POST(req) {
  try {
    await dbConnect();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await Tracking.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Scrape latest price using Puppeteer
    const latestPrice = await puppeteerScraper(product.productUrl);

    if (!latestPrice) {
      return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 });
    }

    // Update the product's latest price and last checked timestamp
    product.currentPrice = latestPrice;
    product.lastChecked = new Date();
    await product.save();

    return NextResponse.json({ message: "Price updated", latestPrice }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
