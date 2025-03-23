import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Tracking from "@/models/Tracking";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const { productId } = await params;
    const productid = Array.isArray(productId) ? productId[0] : productId;

    // Extract userId from request body
    const { userId } = await req.json();

    console.log("Product ID:", productid);
    console.log("User ID:", userId);

    // Validate ObjectId if stored as ObjectId in schema
    if (!mongoose.Types.ObjectId.isValid(productid) || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid Product ID or User ID format" }, { status: 400 });
    }

    // Find and delete the tracking record for the given productId and userId
    const deletedTracking = await Tracking.findOneAndDelete({ productId: productid, userId });

    if (!deletedTracking) {
      return NextResponse.json({ error: "Tracking record not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Tracking record removed successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
