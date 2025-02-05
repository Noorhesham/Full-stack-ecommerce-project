"use client";
import React from "react";
import { ProductProps } from "../types";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useUpdateCart } from "../queries/queries";
import { useQueryClient } from "@tanstack/react-query";
import { calculateFinalPrice, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CartItem = ({
  product,
  variants,
  check = false,
  show = false,showOnly=false
}: {
  product: ProductProps;
  variants?: any;
  check?: boolean;
  show?: boolean;showOnly?:boolean
}) => {
  const { updateCart, isPending } = useUpdateCart();
  const { data } = useSession();
  const queryClient = useQueryClient();
  const handleRemoveItem = (id: string) => {
    if (data?.user) {
      updateCart({ data: { productId: id }, remove: true });
    } else {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const productIndex = cart.findIndex((p: any) => p.productId == product._id);
      if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("storage"));
      }
      window.dispatchEvent(new Event("storage"));

      queryClient.invalidateQueries({ queryKey: [`cart ${id}`] });
    }
  };
  const variantsItems = product.variants || variants;
  const basePrice = calculateFinalPrice(product.price, variantsItems, product.variations);
  console.log(product)
  return (
    <div className=" space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className=" flex items-center space-x-4">
          <div className=" relative aspect-square w-16 h-16 min-w-fit overflow-hidden rounded">
            <Image src={product.images?.[0]?.imgUrl} alt={product.name} fill className=" object-cover" />
          </div>
          <div className="flex flex-col self-start">
            <Link href={`/product/${product._id}`} className=" hover:text-amber-400 hover:underline duration-150 line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </Link>{" "}
            <Link
              href={`/products?category=${product.category?.name}`}
              className=" hover:text-amber-400 hover:underline duration-150 line-clamp-1 text-sm capitalize text-muted-foreground "
            >
              {product.category?.name}
            </Link>
            <Link
              href={`/profile/${product.creator?._id}`}
              className=" hover:text-amber-400 text-xs hover:underline duration-150 line-clamp-1 mt-1 capitalize text-muted-foreground "
            >
              {/*@ts-ignore*/}
              from {product.creator?.firstName} {product.creator?.lastName}
            </Link>
            <div className=" mt-4 text-xs text-muted-foreground">
            {!show&&!showOnly && (
                <Button
                  aria-label="Remove item"
                  variant={"ghost"}
                  onClick={() => handleRemoveItem(product._id)}
                  className="flex  hover:text-amber-400 duration-150 items-center gap-0.5"
                >
                  <X className="w-3 h-4" />
                  Remove
                </Button>
            )}
            </div>
          </div>
          {check && !show && (
            <p className=" mt-4 flex space-x-2 text-sm text-gray-700">
              <Check className=" h-5 w-5  text-green-500" />
              <span>Eligible for free shipping</span>
            </p>
          )}
        </div>
        <div className="flex flex-col  space-y-1 font-medium">
          <span className=" ml-auto line-clamp-1 text-sm">
            {" "}
            <div className=" ml-auto font-medium text-gray-900">
              {product.isOnSale && product?.salePrice ? (
                <p className="flex items-center gap-1 flex-col">
                  {formatPrice(+basePrice - Number(product?.salePrice.replace("$", "")))}
                  <span className=" text-gray-500 line-through">{formatPrice(basePrice)}</span>
                </p>
              ) : (
                formatPrice(basePrice)
              )}
            </div>
          </span>
        </div>
        {variantsItems && variantsItems.length > 0 && (
          <div className="flex flex-col gap-3 items-end">
            {variantsItems.map((variant: any, i: number) =>
              product.variations.map((variation: any, j: number) => {
                const option = variation.variationOptions.find((vo: any) => vo._id == variant);
                if (!option) return;
                return (
                  <div className="flex items-center gap-1" key={variation._id}>
                    <Badge
                      className={`bg-primary text-white
                            cursor-pointer hover:text-gray-50`}
                      key={option._id}
                    >
                      {option.variationOption.title}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
