// Instead of importing at the module level
// import { chromium } from 'playwright-chromium';

export async function getBrowser() {
  // Dynamically import only when the function is called
  const { chromium } = await import('playwright-chromium');
  
  const browser = await chromium.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--single-process",
      "--disable-dev-shm-usage",
      "--headless", // Required for Vercel
    ],
  });
  return browser;
}