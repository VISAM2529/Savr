import { chromium } from "playwright";
export async function getBrowser() {
  return await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Recommended for serverless environments
  });
}
