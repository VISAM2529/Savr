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
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/14.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
];

// Site-specific selectors for common e-commerce platforms
const siteSpecificSelectors = {
  'flipkart.com': [
    '._30jeq3._16Jk6d', // Discounted price class (priority)
    '._30jeq3', // Primary Flipkart price class
    '._16Jk6d', // Another Flipkart price class
    '.dyC4hf', // Another Flipkart price class
    '.CEmiEU', // Flipkart product card price
    '._25b18c', // Another observed price format
  ],
  'amazon': [
    '.a-price-whole',
    '#priceblock_ourprice',
    '#priceblock_dealprice',
    '.a-price .a-offscreen',
  ],
  'default': [
    '.product-price-current',
    '.price-current',
    '.product-price',
    '.offer-price',
    '.sale-price',
    '.special-price',
    '.current-price',
    '.now-price',
    '.price-box .price',
    '.product-info-price .price',
    '.product-info .price',
    'span[itemprop="price"]',
    'meta[itemprop="price"]',
    'meta[property="product:price:amount"]',
    'meta[property="og:price:amount"]',
    '[data-product-price]',
    '.price',
    'span[class*="price"]:not([class*="range"])',
    'div[class*="price"]:not([class*="range"])',
    'p[class*="price"]:not([class*="range"])'
  ]
};

// ... (previous code remains the same)

async function fetchProductDetails(productUrl) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath || "/usr/bin/chromium",
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
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

    // Get product name
    const productName = await page.evaluate(() => {
      return (
        document.querySelector("h1")?.innerText ||
        document.querySelector('meta[property="og:title"]')?.content ||
        document.querySelector('title')?.innerText ||
        "Unknown Product"
      );
    });

    // Get product image
    const imageUrl = await page.evaluate(() => {
      return (
        document.querySelector('meta[property="og:image"]')?.content ||
        document.querySelector('img[src*="product"]')?.src ||
        document.querySelector('img.product-image')?.src ||
        document.querySelector('img[class*="product"]')?.src ||
        document.querySelector('img[class*="main"]')?.src ||
        document.querySelector('img[alt*="product"]')?.src ||
        document.querySelector("img[src]")?.src ||
        document.querySelector("img[data-src]")?.getAttribute("data-src")
      );
    });

    // Return the product details
    return {
      name: productName,
      price: discountedPrice,
      imageUrl: imageUrl || null,
    };
  } catch (error) {
    console.error("❌ Error fetching product details:", error.message);
    return null;
  } finally {
    await browser.close();
  }
}
// ... (rest of the code remains the same)

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productUrl, targetPrice } = await req.json();

    if (!userId || !productUrl || !targetPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch or create product
    let product = await Product.findOne({ url: productUrl });
    if (!product) {
      const productDetails = await fetchProductDetails(productUrl);
      if (!productDetails || !productDetails.price) {
        return NextResponse.json({ error: "Failed to fetch product price" }, { status: 500 });
      }

      const { name, price, imageUrl } = productDetails;

      product = await Product.create({
        url: productUrl,
        name: name || "Unknown",
        currentPrice: price,
        previousPrice: null,
        lastChecked: new Date(),
        imageUrl: imageUrl || null,
      });

      console.log("✅ Product created:", product);
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

    return NextResponse.json({ message: "Product added for tracking", tracking: newTracking }, { status: 201 });
  } catch (error) {
    console.error("❌ Error in POST:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}