const Order = require("../../../lib/database/models/OrderModel.ts");
const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

module.exports.POST = async function (req) {
  const body = req.body;
  const sig = req.headers["stripe-signature"];

  let event;
  console.log("Received webhook:", body, sig);

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("Webhook constructed:", event.type);
  } catch (error) {
    console.error("Error constructing webhook:", error.message);
    return new Response(JSON.stringify({ message: "Webhook error" }), { status: 400 });
  }

  const session = event.data.object;
  console.log("Session:", session);

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    console.error("Invalid session metadata:", session.metadata);
    return new Response(JSON.stringify({ message: "Webhook error" }), { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const order = await Order.findById(session.metadata.orderId).populate({ path: "user", model: "User" });
      console.log("Order found:", order);

      if (!order) {
        console.error("Order not found:", session.metadata.orderId);
        return new Response(JSON.stringify({ message: "Order not found" }), { status: 400 });
      }

      order.isPaid = true;
      order.receipt_url = session.receipt_url;
      await order.save();
      console.log("Order updated to paid:", order);

      return new Response(JSON.stringify({ message: "Webhook processed successfully" }));
    } catch (error) {
      console.error("Error processing order:", error.message);
      return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ message: "Unhandled event type" }), { status: 400 });
};
