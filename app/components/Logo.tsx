import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"} className=" w-16 h-16 sm:w-20 sm:h-20  relative">
      <Image src="/logo.png" className=" absolute object-cover" alt="logo" fill />
    </Link>
  );
};

export default Logo;
