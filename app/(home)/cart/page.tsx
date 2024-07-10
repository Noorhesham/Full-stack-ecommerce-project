"use client";
import { payProduct } from "@/app/actions/pay";
import BabySpinner from "@/app/components/BabySpinner";
import CartItem from "@/app/components/CartItem";
import Loader from "@/app/components/Loader";
import { useGetCart } from "@/app/queries/queries";
import { ProductProps } from "@/app/types";
import { buttonVariants } from "@/components/ui/button";
import { calculateFinalPrice, cn, formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const { cartItems, isLoading } = useGetCart();
  const [isPending, startTransition] = useTransition();
  if (isLoading) return <Loader className="w-40 h-40 m-auto" />;
  const cartTotal = cartItems?.reduce((acc: number, { price, isOnSale, salePrice, variants, variations }: any) => {
    const finalPrice = calculateFinalPrice(price, variants, variations);
    return acc + (isOnSale ? finalPrice - +salePrice.replace("$", "") : finalPrice);
  }, 0);
  const productsData = cartItems.map((item: ProductProps) => {
    return { ...item, price: calculateFinalPrice(item.price, item.variants, item.variations) };
  });
  const handleCheckout = async () => {
    startTransition(async () => {
      const response = await payProduct(productsData, cartTotal);
      if (response) {
        toast.success("redirecting to payment page");
        //@ts-ignore
        redirect(response?.url);
      } else toast.error("An error occurred");
    });
  };
  return (
    <div className=" bg-white">
      <div className=" mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl  lg:px-8">
        <h1 className=" text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zing-200 p-12": cartItems?.length === 0,
            })}
          >
            <h2 className=" sr-only">Items in your shopping cart</h2>
            {cartItems?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-1">
                <div aria-hidden="true" className="relative mb-4 w-40 h-40 text-muted-foreground">
                  <Image src="/empty-cart.png" loading="eager" fill alt="empty cart" />
                </div>
                <h3 className="text-2xl font-semibold">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">Nothing to show here yet.</p>
              </div>
            ) : null}
            <ul
              className={cn({ "divide-y divide-gray-200 border-b  border-gray-200 border-t": cartItems?.length > 0 })}
            >
              {cartItems?.map((product: ProductProps, i: number) => {
                const variantsItems = product.variants;
                return (
                  <CartItem check={true} key={i} product={product} variants={variantsItems}  />
                );
              })}
            </ul>
          </div>
          <section className=" mt-16 bg-gray-50 px-4 py-6 sm:px-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="sr-only text-lg font-medium text-gray-900">Order summary</h2>
            <div className="space-y-6 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrice(cartTotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd>$0.00</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Tax</dt>
                <dd>$0.00</dd>
              </div>
            </div>
            <button
              disabled={isPending}
              onClick={() => handleCheckout()}
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full mt-4")}
            >
              {!isPending ? "Checkout" : <BabySpinner />}
            </button>
            <p className="mt-6 text-center text-sm text-gray-500">or</p>
            <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full mt-4")}>
              Continue Shopping <span aria-hidden="true"> &rarr;</span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
