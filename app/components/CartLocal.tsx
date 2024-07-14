"use client";
import React, { useEffect, useState } from "react";
import { useGetProductCart } from "../queries/queries";
import CartContent from "./CartContent";
import { calculateFinalPrice } from "@/lib/utils";

const CartLocal = () => {
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setLocalCart(cart);
    };

    // Initial load
    handleStorageChange();

    // Listen to local storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const { cart, isLoading } = useGetProductCart(localCart.map((c: any) => c.productId));

  if (isLoading) return null;
  if (!cart) return null;

  const itemsCount = cart?.length;
  const fee = 1;
  //@ts-ignore
  const variants = localCart.map((l) => l.variantId);
  const cartTotal = cart
    .map((c) => c?.product)
    ?.reduce((acc: number, { price, isOnSale, salePrice, variations }: any,i:number) => {
      const finalPrice = calculateFinalPrice(price, variants[i], variations);
      return acc + (isOnSale ? finalPrice - +salePrice.replace("$", "") : finalPrice);
    }, 0);
  return (
    <CartContent
      variants={variants}
      cart={cart.map((c) => c?.product)}
      fee={fee}
      cartTotal={cartTotal}
      itemsCount={itemsCount}
    />
  );
};

export default CartLocal;
