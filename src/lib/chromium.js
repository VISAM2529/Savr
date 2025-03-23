import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export async function getOptions() {
  return {
    args: chromium.args,
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || await chromium.executablePath(),
    headless: true
  };
}

export async function getBrowser() {
  return puppeteer.launch(await getOptions());
}