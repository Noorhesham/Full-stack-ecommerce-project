"use client";
import { Sheet } from "@/components/ui/sheet";
import React from "react";
import { useGetCart } from "../queries/queries";
import CartContent from "./CartContent";
import CartLocal from "./CartLocal";

const Cart = () => {
  const { cartItems, isLoading } = useGetCart();

  const calculateFinalPrice = (price: any, variants: any, variations: any) => {
    let basePrice = typeof price === "number" ? price : +price.replace("$", "");
    if (!variants || !variations) return basePrice;

    variants.forEach((variantId: string) => {
      variations.forEach((variation: any) => {
        const option = variation.variationOptions.find((vo: any) => vo._id == variantId);
        if (option && typeof option.price === "string") {
          basePrice += +option.price.replace("$", "") || 0;
        }
      });
    });

    return basePrice;
  };
  const itemsCount = cartItems?.length;
  const fee = 1;
  const cartTotal = cartItems?.reduce((acc: number, { price, isOnSale, salePrice, variants, variations }: any) => {
    const finalPrice = calculateFinalPrice(price, variants, variations);
    return acc + (isOnSale ? finalPrice - +salePrice.replace("$", "") : finalPrice);
  }, 0);
  return (
    <Sheet>
      {cartItems ? (
        <CartContent cart={cartItems} fee={fee} cartTotal={cartTotal} itemsCount={itemsCount} />
      ) : (
        <CartLocal />
      )}
    </Sheet>
  );
};

export default Cart;
