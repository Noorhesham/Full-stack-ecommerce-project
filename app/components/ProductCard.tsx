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
    }, index * 75);
    return () => clearTimeout(timer);
  }, [index]);
  return isVisible ? (
    <Link
      className={`${cn(" opacity-0  h-full w-full cursor-pointer group-main ", {
        " opacity-100 animate-in duration-200 fade-in-5 shadow-sm rounded-xl": isVisible,
      })} self-stretch flex flex-col `}
      href={`/product/${product._id}`}
    >
      <ImageSlider stock={product.stock} productId={product._id} urls={product.images.map((image) => image.imgUrl)} />
      <div className=" flex flex-col self-stretch justify-between py-1 px-2 w-full">
        <h3 className=" mt-4 font-medium text-sm text-gray-700 ">{product.name}</h3>
       <div className=" mt-auto">
       <p className=" mt-1 text-sm text-gray-500">{product.category.name}</p>
       <p className=" mt-1 font-medium text-sm text-gray-900">{formatPrice(product.price)}</p>
       </div>
      </div>
    </Link>
  ) : (
    <ProductLoader  />
  );
};

export default ProductCard;
