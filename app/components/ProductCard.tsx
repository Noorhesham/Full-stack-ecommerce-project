"use client";
import React, { useEffect } from "react";
import { ProductProps } from "../types";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import ImageSlider from "./ImageSlider";
import { ProductLoader } from "./ProductReel";
const ProductCard = ({ product, index }: { product: ProductProps; index: number }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 45);
    return () => clearTimeout(timer);
  }, [index]);
  return isVisible ? (
    <Link
      className={`${cn("invisible h-full w-full cursor-pointer group/main ", {
        "visible animate-in fade-in-5 shadow-sm rounded-xl": isVisible,
      })}`}
      href={`/product/${product._id}`}
    >
      <ImageSlider stock={product.stock} productId={product._id} urls={product.images.map((image) => image.imgUrl)} />
      <div className=" flex flex-col py-1 px-2 w-full">
        <h3 className=" mt-4 font-medium text-sm text-gray-700 ">{product.name}</h3>
        <p className=" mt-1 text-sm text-gray-500">{product.category.name}</p>
        <p className=" mt-1 font-medium text-sm text-gray-900">{formatPrice(product.price)}</p>
      </div>
    </Link>
  ) : (
    Array.from({ length: 8 }, (_, i) => <ProductLoader key={i} />)
  );
};

export default ProductCard;
