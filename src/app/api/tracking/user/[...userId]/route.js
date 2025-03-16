import dbConnect from "@/lib/dbConnect";
import Tracking from "@/models/Tracking"; // Adjust the model path accordingly

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = await params;

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const trackedProducts = await Tracking.find({ userId });

    return Response.json({ products: trackedProducts }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch tracked products" }, { status: 500 });
  }
}
