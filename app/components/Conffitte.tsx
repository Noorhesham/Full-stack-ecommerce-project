"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import NextLink from "./NextLink";

const Conffitte = ({ img, text }: { img: string; text: string }) => {
  const [isRunning, setIsRunning] = useState(false);

  useEffect(function () {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 20000);
  }, []);
  return (
    <div className="flex items-center pt-28 overflow-hidden gap-3 flex-col ">
      {isRunning && <Confetti className=" z-30" numberOfPieces={200} width={1500} height={700} />}
      {img && <Image className="z-10 floating-image" alt="result" width={300} height={300} src={`/loading2.gif`} />}
      <div className=" text-gray-950 text-xl md:text-2xl lg:text-3xl  font-semibold">
        <h1>{text}</h1>
        <p className=" mt-4 text-muted-foreground text-base md:text-lg">
          Now is the time to publish your product and get the customers to buy it !
        </p>
        <NextLink className="mt-5" text="Browse Products" href="/products" />
      </div>
    </div>
  );
};

export default Conffitte;
