"use server";

import Product from "@/lib/database/models/ProductsModel";
import User from "@/lib/database/models/UserModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import VariationOption from "@/lib/database/models/VariationOptionModel";
import Variation from "@/lib/database/models/VariationModel";

export async function addToCart(productId: string, variants?: string[]) {
  try {
    const session = await getServerSession(authOptions);
    console.log(productId)
    const user = await User.findById(session?.user.id);
    if (!user) throw new Error("User not found");
    user.cart.push({
      productId,
      variants,
    });

    await user.save();

    return { success: "Product added to cart", status: 200 };
  } catch (error: any) {
    console.log(error);
    return { error: error.message, status: 500 };
  }
}

export async function removeFromCart(productId: string) {
  try {
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user.id);
    if (!user) throw new Error("User not found");

    const productIndex = user.cart.findIndex((item: any) => item.productId.toString()=== productId);
    console.log(productIndex,productId,user.cart)
    if (productIndex !== -1) {
      user.cart.splice(productIndex, 1);
      await user.save();
    }

    return { success: "Product removed from cart", status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function clearCart(userId: string) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.cart = [];
    await user.save();
    return { success: "Cart cleared", status: 200 };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}
export async function getCart() {
  try {
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user.id)
      .populate({
        path: "cart.productId",
        model: Product,
        select: "name variations images price sale stock _id salePrice isOnSale",
        populate: [
          {
            path: "variations",
            model: Variation,
            populate: {
              path: "variationOptions",
              model: VariationOption,
              populate: {
                path: "variationOption",
                model: "VariationOption",
              },
            },
          },
          {
            path: "creator",
            model: "User",
          },
        ],
      })
      .lean();
    const userData = JSON.parse(JSON.stringify(user));
    if (!user) throw new Error("User not found");
    //@ts-ignore
    return { success: "Cart fetched", status: 200, cart: userData.cart };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function getProductByIdCart(id: string) {
  try {
    const product = await Product.findById(id).select("name images price sale stock _id salePrice isOnSale").lean();
    if (!product) return { error: "Product not found", status: 404 };
    return { success: "Product fetched", status: 200, product };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}
export async function getUserDetails() {
  try {
    const session = await getServerSession(authOptions);
    const user = await User.findById(session?.user.id).lean();
    if (!user) throw new Error("User not found");
    return { success: "User details fetched", status: 200, data: { user } };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function updateUserData(data: any) {
  try {
    const { phoneNumber, address, city, location, photo, firstName, lastName } = data;
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("User not found");
    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        phoneNumber,
        address,
        city,
        location,
        photo: photo && { imgUrl: photo.secure_url || photo.imgUrl, publicId: photo.public_id || photo.publicId },
        firstName,
        lastName,
      },
      { new: true }
    ).lean();
    return { success: "User details updated", status: 200, data: { user } };
  } catch (error: any) {
    return { error: error.message, status: 500 };
  }
}

export async function getSalesData(createdAfter: Date | null, createdBefore: Date | null) {
  try {
    const totalSales = Order.aggregate([{ $sum: "$totalPrice" }]);
    const orders = Order.find({ createdAt: { $gte: createdAfter, $lte: createdBefore } })
      .sort({ createdAt: -1 })
      .select("createdAt totalPrice")
      .lean();
  } catch {}
}
