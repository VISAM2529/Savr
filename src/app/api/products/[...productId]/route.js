import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; // Your database connection utility
import Product from "@/models/Product"; // Import your Product model

// GET endpoint to fetch product details
export async function GET(request, { params }) {
  const { productId } = params;

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnect();

    // Fetch product details using the Product model
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Return the product details
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { message: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}