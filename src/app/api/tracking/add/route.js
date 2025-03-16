import { NextResponse } from "next/server";
import Tracking from "@/models/Tracking";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { userId, productUrl, targetPrice } = await req.json();

    if (!userId || !productUrl || !targetPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch or create product
    let product = await Product.findOne({ url: productUrl });
    if (!product) {
      product = await Product.create({ url: productUrl });
    }

    // Create tracking entry
    const newTracking = await Tracking.create({
      userId, 
      productId: product._id, 
      productUrl,
      targetPrice,
    });

    return NextResponse.json(
      { message: "Product added for tracking", tracking: newTracking },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
