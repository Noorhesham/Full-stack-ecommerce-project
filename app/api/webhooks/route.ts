import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
export async function POST(req: NextRequest, res: NextResponse) {
  const payload = await req.text();
  const response = JSON.parse(payload);
  const sig = req.headers.get("Stripe-Signature")!;
  const date = new Date(response?.created * 1000).toLocaleDateString();
  const timeString = new Date(response?.created * 1000).toLocaleTimeString();
  try {
    let event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log(event, event.type);
    return NextResponse.json({ message: "success", event: event.type, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Webhook error" }, { status: 400 });
  }
}
