import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Your database connection utility
import Product from "@/models/Product"; // Import your Product model

// GET endpoint to fetch product details
export async function GET(request, { params }) {
  const { productId } = params;

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
    // Connect to the database
    await dbConnect();

    // Fetch product details using the Product model
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Return the product details
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { message: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}