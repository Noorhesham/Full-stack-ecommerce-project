import connect from "@/lib/database/connect";
import Product from "@/lib/database/models/ProductsModel";
import Review from "@/lib/database/models/ReviewModel";
import { cache } from "react";

export const getProduct = cache(async(id: string) => {
  try {
    await connect();
    const product = await Product.findById(id)
      .populate("category")
      .populate("creator")
      .populate("subCategories")
      .populate({
        path: "variations.variation",
        model: "Variation",
      })
      .populate({
        path: "variations.variationOptions.variationOption",
        model: "VariationOption",
      })
      .populate({ path: "creator", model: "User" })
      .populate({ path: "reviews", model: Review, populate: { path: "user", model: "User" } })
      .lean();
    if (!product) throw new Error("Product not found");
    return { product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    console.log(error);
  }
});
