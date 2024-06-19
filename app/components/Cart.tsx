"use client";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Cart = () => {
  const itemsCount = 0;
  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className=" group-hover:text-gray-500 duration-200 h-6 w-6 flex-shrink-0 text-gray-400"
        />
        <span className=" ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{itemsCount}</span>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg">
        <SheetHeader className=" space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemsCount}) Items</SheetTitle>
        </SheetHeader>
        {itemsCount > 0 ? (
          <>
            <div className="flex flex-col w-full pr-6">cart items</div>
            <div className=" space-y-4 pr-6">
              <Separator />
              <div className=" space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(1)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(1)}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link className={buttonVariants({ className: "w-full" })} href="/cart">
                    Continue to checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full h-full gap-10  items-center justify-center space-y-1">
            <div className=" relative  h-60 w-60 text-muted-foreground">
              <Image fill src={"/emptyCart.png"} className=" object-contain" alt="Empty cart" aria-hidden="true" />
            </div>
            <div className=" w-full flex flex-col items-center gap-2">
              <div className=" capitalize text-xl font-semibold ">Your cart is empty ! 😸</div>
              <SheetTrigger asChild>
                <Link
                  className={buttonVariants({
                    className: " capitalize text-sm text-muted-foreground",
                    variant: "link",
                    size: "sm",
                  })}
                  href="/products"
                >
                  add items to your cart to check out
                </Link>
              </SheetTrigger>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
