import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

// Initialize puppeteer based on environment
export async function initPuppeteer() {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    // Vercel/production environment
    return puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    });
  } else {
    // Local development environment
    const puppeteerLocal = require('puppeteer');
    return puppeteerLocal.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
}