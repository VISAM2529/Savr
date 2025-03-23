import { chromium } from "playwright-chromium";
export const getBrowser = async () => {
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
};
