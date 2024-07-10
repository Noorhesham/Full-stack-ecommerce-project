"use server";

import connect from "@/lib/database/connect";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const Order = require("../../lib/database/models/OrderModel.ts");
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});
export const payProduct = async (data: any, totalPrice: number) => {
  await connect();
  const session = await getServerSession(authOptions);
  const order = await Order.create({
    products: data.map((product: any) => {
      return {
        productId: product._id,
        variants: product.variants,
      };
    }),
    user: session?.user.id,
    country: "USA",
    shippingPrice: 1,
    paymentMethod: "paynow",
    shippingAddress: "123 Main St",
    price: totalPrice,
    name: "meow",
    totalPrice,
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = data.map((product: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        images: product.images.map((image: any) => image.imgUrl), // Ensure this is an array of URLs
      },
      unit_amount: product.price * 100, // Stripe expects the price in cents
    },
    quantity: 1,
  }));
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXTAUTH_URL!!}/thank-you?orderId=${order._id}`,
      cancel_url: `${process.env.NEXTAUTH_URL!!}/cart`,
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      metadata: {
        orderId: `${order._id}`,
        userId: session?.user.id,
      },
      customer_email: session?.user.email,
    });
    console.log("Stripe session created:", stripeSession);

    return stripeSession;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create Stripe session");
  }
};

export const getOrderStatus = async (orderId: string) => {
  try {
    await connect();
    const order = await Order.findById(orderId)
      .populate({
        path: "products.productId",
        model: "Product",
        populate: {
          path: "variations.variationOptions.variationOption",
          model: "VariationOption",
        },
      })
      .populate({
        path: "user",
        model: "User",
      })
      .lean();
    if (!order) return;

    return { order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get order status");
  }
};
export const emailSent = async (id: string) => {
  try {
    await connect();
    const order = await Order.findById(id);
    order.isEmailSent = true;
    await order.save();
    return { success: "email sent" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get order status");
  }
};
