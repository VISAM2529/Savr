import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export async function getOptions() {
  return {
    args: chromium.args,
    executablePath: await chromium.executablePath() || '/usr/bin/chromium',
    headless: true
  };
}

export async function getBrowser() {
  return puppeteer.launch(await getOptions());
}