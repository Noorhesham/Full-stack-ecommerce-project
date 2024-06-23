import React from "react";
import AnimatedImage from "./AnimatedImage";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={`${className || "w-40 h-40"} my-auto text-center  mx-auto `}>
      <AnimatedImage className=" w-full h-full" />
    </div>
  );
};

export default Loader;
