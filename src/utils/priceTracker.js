import dbConnect from "@/lib/dbConnect";
import Tracking from "@/models/Tracking";
import User from "@/models/User";
import { fetchProductPrice } from "./fetchProductPrice";
import { sendEmailNotification } from "./sendEmail";

export async function checkPriceDrops() {
  await dbConnect();
  const trackedProducts = await Tracking.find({});

  for (let tracking of trackedProducts) {
    const currentPrice = await fetchProductPrice(tracking.productUrl);

    if (currentPrice && currentPrice <= tracking.targetPrice) {
      const user = await User.findById(tracking.userId);
      if (user) {
        await sendEmailNotification(user.email, tracking.productUrl, currentPrice);
      }
    }
  }
}
