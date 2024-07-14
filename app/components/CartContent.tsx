import React from "react";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { ProductProps } from "../types";
import CartItem from "./CartItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import MapComponent from "./Map";
import { cn } from "../utils/cn";
import "leaflet/dist/leaflet.css"; 

const CartContent = ({
  cart,
  fee,
  cartTotal,
  itemsCount,
  variants,
  showOnly = false,
  location,address
}: {
  cart: any;
  fee: number;
  cartTotal: number;
  itemsCount: number;
  variants?: any;
  showOnly?: boolean;
  location?: { lat: number; lng: number };address?:string
}) => {
  return (
    <>
      <SheetTrigger className="group  flex items-center ">
        {showOnly ? (
          <div className={cn("w-fit", buttonVariants({ variant: "outline" }))}>Show Order Details</div>
        ) : (
          <>
            <ShoppingCart
              aria-hidden="true"
              className=" group-hover:text-gray-500 m-auto duration-200 h-6 w-6 flex-shrink-0 text-gray-400"
            />
            <span className=" ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{itemsCount}</span>
          </>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg">
        <SheetHeader className=" space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemsCount}) Items</SheetTitle>
        </SheetHeader>
        {itemsCount > 0 ? (
          <>
            <div className="flex flex-col  w-full pr-6">
              <ScrollArea className=" h-[30rem]">
                {cart.map((product: ProductProps, i: number) => (
                  <CartItem showOnly={showOnly} variants={variants?.[i] || []} key={i} product={product} />
                ))}
            {location && (
              <div className="space-y-4 ">
                <h1 className="text-xl font-semibold">Delivery Location</h1>
                <p className="text-sm text-muted-foreground">{address}</p>
                <div className=" max-w-3xl h-60">
                  <MapComponent defaultLocation={location} />
                </div>
              </div>
            )}
              </ScrollArea>
            </div>
            <div className=" space-y-4 pr-6">
              <Separator />
              <div className=" space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              {!showOnly && (
                <SheetFooter>
                  <SheetTrigger asChild>
                    <Link className={buttonVariants({ className: "w-full" })} href="/cart">
                      Continue to checkout
                    </Link>
                  </SheetTrigger>
                </SheetFooter>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full h-full gap-10  items-center justify-center space-y-1">
            <div className=" relative  h-60 w-60 text-muted-foreground">
              <Image fill src={"/emptyCart.jpg"} className=" object-contain" alt="Empty cart" aria-hidden="true" />
            </div>
            <div className=" w-full flex flex-col items-center gap-2">
              <div className=" capitalize text-xl font-semibold ">Your cart is empty ! 😸</div>
              <SheetTrigger asChild>
                <Link
                  className={buttonVariants({
                    className: " capitalize text-sm  text-amber-500 hover:text-amber-400 text-muted-foreground",
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
    </>
  );
};

export default CartContent;
