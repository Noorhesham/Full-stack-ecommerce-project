import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <div className=" w-20 h-20  relative">
      <Image src="/logo.png" className=" absolute object-cover" alt="logo" fill />
    </div>
  );
};

export default Logo;
