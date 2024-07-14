const Order = require("../../../lib/database/models/OrderModel.ts");
const Stripe = require("stripe");
const dotenv = require("dotenv");
const { model } = require("mongoose");
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const addTestFunds = async (amount) => {
  try {
    const charge = await stripe.charges.create({
      amount,
      currency: "usd",
      source: "tok_bypassPending",
      description: "Adding test funds to account",
    });
    console.log("Test funds added:", charge);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Ensure the funds are available
  } catch (error) {
    console.error("Error adding test funds:", error.message);
  }
};

module.exports.POST = async function (req) {
  const body = req.body;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Error constructing webhook:", error.message);
    return new Response(JSON.stringify({ message: "Webhook error" }), { status: 400 });
  }

  const session = event.data.object;
  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    console.error("Invalid session metadata:", session.metadata);
    return new Response(JSON.stringify({ message: "Webhook error" }), { status: 400 });
  }
  
  if (event.type === "checkout.session.completed") {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );
    try {
      const order = await Order.findById(session.metadata.orderId).populate({
        path: "products.productId",
        model: "Product",
        populate: {
          path: "creator",
          model: "User",
        },
      });

      if (!order) {
        return new Response(JSON.stringify({ message: "Order not found" }), { status: 400 });
      }

      order.isPaid = true;
      order.receipt_url = session.receipt_url;
      await order.save();

      const sellerTransfers = {};

      for (const product of order.products) {
        const seller = product.productId.creator;
        const price = (product.productId.price - Number(product.productId.salePrice.replace("$", ""))) * 100;

        if (!sellerTransfers[seller._id]) {
          sellerTransfers[seller._id] = {
            amount: 0,
            stripeAccountId: seller.stripeAccountId,
          };
        }

        sellerTransfers[seller._id].amount += price;

        const variants = product.variants;
        const variations = product.productId.variations;

        variants.forEach((variantId) => {
          if (!variantId) return;

          variations.forEach((variation) => {
            const option = variation.variationOptions.find((vo) => vo._id == variantId);
            if (option && typeof option.price === "string") {
              sellerTransfers[seller._id].amount += Math.round(+option.price.replace("$", "") * 100) || 0;
            }
          });
        });
      }

      const totalAmount = Object.values(sellerTransfers).reduce((sum, transfer) => sum + transfer.amount, 0);

      for (const sellerId in sellerTransfers) {
        const transfer = sellerTransfers[sellerId];
        const transferAmount = Math.round(transfer.amount);

        console.log(`Creating transfer for seller ${sellerId} with amount ${transferAmount}`);
        try {
          console.log(paymentIntent);
          await stripe.transfers.create({
            amount: transferAmount,
            currency: "aed",
            destination: transfer.stripeAccountId,
            source_transaction: paymentIntent.latest_charge,
          });

          console.log(`Transfer created for seller ${sellerId}: ${transferAmount}`);
        } catch (error) {
          console.error(`Error creating transfer for seller ${sellerId}: ${error.message}`);
        }
      }

      return new Response(JSON.stringify({ message: "Webhook processed successfully" }));
    } catch (error) {
      console.error("Error processing order:", error.message);
      return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ message: "Unhandled event type" }), { status: 400 });
};
