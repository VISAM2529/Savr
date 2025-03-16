import cron from "node-cron";
import { checkPriceDrops } from "@/utils/priceTracker";

cron.schedule("0 * * * *", () => {
  console.log("Running price tracker...");
  checkPriceDrops();
});
