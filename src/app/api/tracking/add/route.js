
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product";
import Tracking from "@/models/Tracking";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/14.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
];

async function fetchProductDetails(productUrl) {
  let browser;
  browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath || process.env.PUPPETEER_EXECUTABLE_PATH,
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();
  await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);
  
  // Set viewport for better rendering
  await page.setViewport({ width: 1280, height: 800 });

  try {
    console.log(`🔍 Fetching product from: ${productUrl}`);
    await page.goto(productUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // Scroll to trigger lazy loading
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = window.innerHeight / 2; // Adjust dynamically
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 300);
      });
    });

    // Wait for essential elements with longer timeout
    await page.waitForSelector("h1, meta[property='og:title']", { timeout: 10000 }).catch(() => {
      console.log("⚠️ Title element not found within timeout");
    });
    
    // Use delay instead of waitForTimeout
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract the discounted price using the correct selector
    const discountedPrice = await page.evaluate(() => {
      // Target the discounted price element
      const discountedPriceElement = document.querySelector('.GURu5w._5V8g3p');
      if (discountedPriceElement) {
        const priceText = discountedPriceElement.innerText || discountedPriceElement.textContent;
        if (priceText) {
          // Extract the numeric value from the price text
          const match = priceText.match(/₹\s*([0-9,]+)/);
          if (match && match[1]) {
            const cleanNumber = match[1].replace(/,/g, '');
            return parseFloat(cleanNumber);
          }
        }
      }
      return null;
    });

    if (discountedPrice) {
      console.log(`✅ Found discounted price: ₹${discountedPrice}`);
    } else {
      console.log("⚠️ Discounted price not found");
    }

    let price = $('meta[property="product:price:amount"]').attr('content') || $('span.price').text().trim();
    if (!price) {
      console.error("Product price not found.");
    }

    // Log the scraped details
    console.log("Scraped Product Details - Name:", name);
    console.log("Scraped Product Details - Category:", category);
    console.log("Scraped Product Details - Price:", price);

    return { name, category, price };

  } catch (error) {
    if (error.response && error.response.status === 529 && retryCount < 3) {
      // Retry with exponential backoff
      const delay = Math.pow(2, retryCount) * 1000; // 1, 2, 4 seconds
      console.log(`Retrying after ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchProductDetails(productUrl, retryCount + 1);
    }
    console.error('Error fetching product details:', error.message);
    return null;
  }
}


export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productUrl, targetPrice } = await req.json();

    if (!userId || !productUrl || !targetPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch or create product
    let product = await Product.findOne({ url: productUrl });
    if (!product) {
      const productDetails = await fetchProductDetails(productUrl); // Get product details

      if (!productDetails) {
        return NextResponse.json({ error: "Product details could not be fetched" }, { status: 500 });
      }

      const { name, category, price } = productDetails;

      // Create a new product with the fetched details
      product = await Product.create({
        url: productUrl,
        name: name || "Unknown",
        category: category || "Unknown",
        currentPrice: price || null,
        previousPrice: null,
        lastChecked: new Date(),
        imageUrl: null,  // You can add image handling later if needed
      });

      console.log("Product created:", product); // Log the newly created product
    }

    // Create tracking entry
    const newTracking = await Tracking.create({
      userId,
      productId: product._id,
      productUrl,
      targetPrice,
      currentPrice: product.currentPrice,
      lastChecked: product.lastChecked,
    });

    return NextResponse.json(
      { message: "Product added for tracking", tracking: newTracking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
