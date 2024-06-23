import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const NextStep = ({ text, url ,children,disabled}: { text: string; url: string,children?:ReactNode,disabled?:boolean }) => {
  const current_path = usePathname();
  return (
    <div className="w-full flex mt-5 gap-2 items-center ">
      <Button disabled={disabled} className=" w-[65%] relative ">{text}
        {children}
      </Button>
      <Link
        className={`${buttonVariants({ variant: "ghost" })} hover:text-rose-500 flex items-center`}
        href={`${current_path.replace("images", "")}${url}`}
      >
        Next step <MdOutlineKeyboardDoubleArrowRight className="arrow1" />
      </Link>
    </div>
  );
};

export default NextStep;
