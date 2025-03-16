import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req) {
  try {
    const { phoneNumber, productName, productUrl, currentPrice, targetPrice } = await req.json();

    if (!phoneNumber || !productName || !productUrl || !currentPrice || !targetPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    const messageBody = `🔥 Price Drop Alert: ${productName} is now ₹${currentPrice} (Your Target: ₹${targetPrice}). Buy now: ${productUrl}`;

    await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return NextResponse.json({ message: "SMS notification sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
