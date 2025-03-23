import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Tracking from "@/models/Tracking";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    // Extract productId correctly
    const { productId } = await params;
    const productid = Array.isArray(productId) ? productId[0] : productId;

    console.log("Product ID:", productid);

    // Validate ObjectId if productId is stored as an ObjectId in schema
    if (!mongoose.Types.ObjectId.isValid(productid)) {
      return NextResponse.json({ error: "Invalid Product ID format" }, { status: 400 });
    }

    // Use findOneAndDelete since productId is a field, not _id
    const deletedProduct = await Tracking.findOneAndDelete({ productId: productid });

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product tracking removed" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
