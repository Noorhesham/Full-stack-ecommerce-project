"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type SwiperType from "swiper";
import { Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductProps } from "../types";
import ProductCard from "./ProductCard";

const ProductSlider = ({ products }: { products: ProductProps[] }) => {
  const [swiper, setSwiper] = React.useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [slideConfig, setSlideConfig] = React.useState({
    isBeginning: true,
    isEnd: activeIndex === (products.length ?? 0) - 1,
  });

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (products.length ?? 0) - 1,
      });
    });
  }, [swiper, products]);

  const inactiveStyles = "hidden text-gray-100";
  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";

  return (
    <div className="group col-span-full relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slideNext();
          }}
          className={cn(activeStyles, "right-3 transition", {
            [inactiveStyles]: slideConfig.isEnd,
            "hover:bg-amber-300 text-amber-800 opacity-100": !slideConfig.isEnd,
          })}
          aria-label="next image"
        >
          <ChevronRight className="h-4 w-4 text-zinc-700" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(inactiveStyles, "left-3 transition", {
            [activeStyles]: !slideConfig.isBeginning,
            "hover:bg-orange-300 text-orange-800 opacity-100": !slideConfig.isBeginning,
          })}
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />
        </button>
      </div>
      <div className="relative  gap-3 w-full flex flex-col">
        <Swiper
          pagination={{
            renderBullet: (_, className) => {
              return `<span class="rounded-full transition bg-orange-400 ${className}"></span>`;
            },
          }}
          onSwiper={(swiper) => setSwiper(swiper)}
          spaceBetween={50}
          slidesPerView={4}
          modules={[Pagination]}
          className=" w-full"
        >
          {products.map((url, i) => (
            <SwiperSlide className="z-50 select-none  relative  w-full" key={i}>
              <ProductCard index={i} product={url} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSlider;
