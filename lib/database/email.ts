"use server";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import Activation from "./models/ActivationModel";
import { ReceiptEmailHtml } from "@/app/components/Email";

const emailUser = process.env.EMAIL_USER!;
const emailPassword = process.env.EMAIL_PASSWORD!;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

export async function sendConfirmationEmail(to: string, id: string) {
  try {
    const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, "");
    await Activation.create({ token, user: id });
    const info = await transporter.sendMail({
      from: emailUser,
      to,
      subject: "Email Confirmation",
      text: "Please confirm your email by clicking the link.",
      html: `<a href="${process.env.NEXTAUTH_URL}/verify-email?email=${to}&token=${token}">Verify Account</a>`,
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Email sent successfully! check your inbox to confirm your email." };
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendWelcomeEmail(to: string) {
  try {
    const info = await transporter.sendMail({
      from: emailUser, // Sender address
      to,
      subject: "Welcome to Our Service",
      text: "Welcome to our service! We are glad to have you.",
      html: "<b>Welcome to our service! We are glad to have you.</b>",
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendPaymentEmail(
  to: string,
  {
    email,
    products,
    total,
    orderId,
  }: { email: string; products: any[]; total: number; orderId: string; }
) {
  try {
    const info = await transporter.sendMail({
      from: emailUser, // Sender address
      to,
      subject: "Payment Successful",
      text: "Payment Successful",
      html: ReceiptEmailHtml({ email, date: new Date(), products, total, orderId }),
    });

    console.log("Message sent: %s", info.messageId);
    return {
      success: true,
      message: "Email sent successfully! check your inbox to see receipt details and order info.",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "Error sending email" };
  }
}
