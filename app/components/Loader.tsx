import React from "react";
import AnimatedImage from "./AnimatedImage";
import Image from "next/image";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={`${className || "w-40 h-40"} my-auto relative text-center  mx-auto `}>
      <Image src="/loader.gif" fill alt="loader" className=" object-contain absolute" />
    </div>
  );
};

export default Loader;
