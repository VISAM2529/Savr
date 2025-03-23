import puppeteer from 'puppeteer';

async function scrapeWithPuppeteer(url) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(), // Ensure the correct executable path
    });

    const page = await browser.newPage();

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUserAgent);

    console.log(`Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Scrape the product details
    const productDetails = await page.evaluate(() => {
      const title = document.querySelector('span.B_NuCI') ? document.querySelector('span.B_NuCI').innerText : '';
      const price = document.querySelector('div._30jeq3') ? document.querySelector('div._30jeq3').innerText : '';
      const image = document.querySelector('img._396cs4') ? document.querySelector('img._396cs4').src : '';
      const description = document.querySelector('div._1mXcCf') ? document.querySelector('div._1mXcCf').innerText : '';
      const rating = document.querySelector('div._3LWZlK') ? document.querySelector('div._3LWZlK').innerText : '';
      const brand = document.querySelector('a._2whKao') ? document.querySelector('a._2whKao').innerText : '';

      return { title, price, image, description, rating, brand };
    });

    console.log('Product details scraped successfully');
    await browser.close();
    return productDetails;
  } catch (error) {
    console.error('Error scraping with Puppeteer:', error);
    throw error;
  }
}

export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get('url');
  if (!url) {
    return new Response(
      JSON.stringify({ error: 'URL is required' }),
      { status: 400 }
    );
  }

  try {
    const productDetails = await scrapeWithPuppeteer(url);
    return new Response(JSON.stringify(productDetails), { status: 200 });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch product details' }),
      { status: 500 }
    );
  }
}
