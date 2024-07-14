import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { ReactNode, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type SwiperType from "swiper";
import { cn } from "../utils/cn";

const ZoomImage = ({ btn, urls, active }: { btn: ReactNode; urls: string[]; active?: number }) => {
  const [swiper, setSwiper] = React.useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = React.useState(active);
  const [slideConfig, setSlideConfig] = React.useState({
    isBeginning: active===0,
    isEnd: active === (urls.length ?? 0) - 1,
  });

  useEffect(() => {
    if (swiper) {
      if (active) swiper.slideTo(active, 0);
      swiper.on("slideChange", () => {
        const index = swiper.activeIndex;
        setActiveIndex(index);
        setSlideConfig({
          isBeginning: index === 0,
          isEnd: index === (urls.length ?? 0) - 1,
        });
      });
    }
  }, [swiper, urls, active]);
  const inactiveStyles = "hidden text-gray-100";
  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";
  return (
    <Dialog>
      <DialogTrigger asChild>{btn}</DialogTrigger>
      <DialogContent className="   w-full h-full sm:max-w-7xl max-h-[80vh]">
        <Swiper
          initialSlide={activeIndex}
          onSwiper={(swiper) => setSwiper(swiper)}
          spaceBetween={50}
          slidesPerView={1}
          className="h-full w-full"
        >
          {urls.map((url, i) => (
            <SwiperSlide className="-z-10 select-none  relative h-full w-full" key={i}>
              <Image
                fill
                loading="eager"
                src={url}
                alt="product image"
                className="-z-10 h-full w-full object-contain object-center"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log(e);
            swiper?.slideNext();
          }}
          className={cn(activeStyles, "right-3 transition", {
            [inactiveStyles]: slideConfig.isEnd,
            "hover:bg-orange-300 text-orange-800 opacity-100": !slideConfig.isEnd,
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
      </DialogContent>
    </Dialog>
  );
};

export default ZoomImage;
