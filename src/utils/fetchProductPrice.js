import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchProductPrice(productUrl) {
  try {
    const { data } = await axios.get(productUrl);
    const $ = cheerio.load(data);

    const priceText = $(".price-class").text().trim(); // Change selector based on site structure

    if (!priceText) throw new Error("Price not found");

    const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
    return price;
  } catch (error) {
    console.error("Error fetching price:", error.message);
    return null;
  }
}
