import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, productName, productUrl, currentPrice, targetPrice } = await req.json();

    if (!email || !productName || !productUrl || !currentPrice || !targetPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: `Price Drop Alert: ${productName}`,
      html: `
        <p>Good news! The price of <strong>${productName}</strong> has dropped below your target price.</p>
        <p>Current Price: <strong>₹${currentPrice}</strong></p>
        <p>Your Target Price: <strong>₹${targetPrice}</strong></p>
        <p><a href="${productUrl}" target="_blank">Click here to buy now</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email notification sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
