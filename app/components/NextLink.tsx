import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const NextLink = ({ href, text, className }: { href: string; text?: string; className?: string }) => {
  return (
    <Link
      className={`${buttonVariants({ variant: "outline" })} ${className || ""} hover:text-rose-500 flex items-center`}
      href={href}
    >
      {text || "Next step"} <MdOutlineKeyboardDoubleArrowRight className="arrow1" />
    </Link>
  );
};

export default NextLink;
