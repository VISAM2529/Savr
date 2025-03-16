import nodemailer from "nodemailer";

export async function sendEmailNotification(userEmail, productUrl, newPrice) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Price Drop Alert!",
    html: `<p>The price of <a href="${productUrl}">this product</a> has dropped to <strong>${newPrice}</strong>!</p>`,
  });

  console.log(`Email sent to ${userEmail}`);
}
