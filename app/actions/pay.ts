"use server";

import connect from "@/lib/database/connect";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
const Order = require("../../lib/database/models/OrderModel.ts");
import Stripe from "stripe";
import User from "@/lib/database/models/UserModel";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});
export const payProduct = async (
  data: any,
  totalPrice: number,
  shippingAddress: string,
  city: string,
  location: any
) => {
  await connect();
  //@ts-ignore
  const sellers = [...new Set(data.map((product: any) => product.creator._id).filter((id) => id))];
  const session = await getServerSession(authOptions);
  const user = await User.findById(session?.user.id);
  const order = await Order.create({
    products: data.map((product: any) => {
      return {
        productId: product._id,
        variants: product.variants,
      };
    }),
    user: session?.user.id, //the guy who purchased
    city,
    shippingPrice: 1,
    paymentMethod: "card",
    shippingAddress,
    price: totalPrice,
    totalPrice,
    sellers,
    location,
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = data.map((product: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: product.name,
        images: product.images.map((image: any) => image.imgUrl), // Ensure this is an array of URLs
      },
      unit_amount: Math.round((product.price - Number(product.salePrice.replace("$", ""))) * 100), // Stripe expects the price in cents
    },
    quantity: 1,
  }));
  try {
    const stripeSession = await stripe.checkout.sessions.create({
      //@ts-ignore
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
      payment_intent_data: {
        transfer_data: {
          destination: process.env.PLATFORM_ACCOUNT_ID, // Your platform account ID
        },
      },
    });
    // acct_1PagrkRpqbf3DcZG
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

export const CreateStripeAccount = async (email: string) => {
  try {
    await connect();
    const account = await stripe.accounts.create({
      type: "standard",
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    console.log(account);
    const user = await User.findOne({ email });
    user.stripeAccountId = account.id;
    await user.save();
    return { success: "Stripe account created to receive payments" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create Stripe account");
  }
};
export const getOrders = async (page: number, pageSize = 10, customer: boolean = false) => {
  try {
    const skip = (page - 1) * pageSize;
    await connect();
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    const orders = await Order.find(customer ? { sellers: { $in: [userId] } } : { user: userId })
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate({
        path: "products.productId",
        model: "Product",
        populate: [
          {
            path: "variations.variationOptions.variationOption",
            model: "VariationOption",
          },
          { path: "creator", model: "User" },
        ],
      })
      .populate({
        path: "user",
        model: "User",
      })
      .lean();
    const totalCount = await Order.countDocuments({ user: session?.user.id });
    const ordersObj = JSON.parse(JSON.stringify(orders));
    return { orders: ordersObj, totalCount, totalPages: Math.ceil(totalCount / pageSize),currentPage: page };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get order status");
  }
};

export const updateOrderStatus = async (data: any, orderId: string) => {
  try {
    await connect();
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");
    order.status = data.status;
    if (data.status === "delivered") {
      order.isDelieverd = true;
      order.deliveredAt = new Date();
    }
    await order.save();
    return { success: "Order status updated" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update order status");
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    await connect();
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) throw new Error("Order not found");
    return { success: "Order deleted" };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete order");
  }
};
