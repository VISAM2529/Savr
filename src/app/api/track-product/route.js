import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tracking from "@/models/Tracking";
import Product from "@/models/Product";
import puppeteer from "puppeteer";

export async function GET() {
  try {
    await dbConnect();
    
    // Get all tracking entries
    const trackings = await Tracking.find();
    
    if (!trackings.length) {
      return NextResponse.json({ message: "No products to track." }, { status: 200 });
    }

    // Launch Puppeteer for scraping
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let tracking of trackings) {
      await page.goto(tracking.productUrl, { waitUntil: "load" });

      // Example: Extract price from an e-commerce site (Update selector as needed)
      const price = await page.evaluate(() => {
        return document.querySelector(".price")?.innerText || "N/A";
      });

      console.log(`Product: ${tracking.productUrl}, Price: ${price}`);

      // Notify user if price is below target
      if (price !== "N/A" && parseFloat(price.replace(/[^\d.]/g, "")) <= tracking.targetPrice) {
        console.log(`Sending notification to: ${tracking.userEmail}`);
        // Send email or push notification (implement below)
      }
    }

    await browser.close();

    return NextResponse.json({ message: "Price tracking completed." }, { status: 200 });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
