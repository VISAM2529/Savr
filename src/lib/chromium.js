import { chromium } from 'playwright-chromium';

export async function getBrowser() {
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
