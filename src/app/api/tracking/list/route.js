import { NextResponse } from "next/server";
import Tracking from "@/models/Tracking";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const trackedProducts = await Tracking.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ products: trackedProducts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
