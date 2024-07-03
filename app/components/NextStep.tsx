import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import NextLink from "./NextLink";

const NextStep = ({
  text,
  url,
  children,
  disabled,
  isReady = true,
  error,
}: {
  text: string;
  url: string;
  children?: ReactNode;
  disabled?: boolean;
  isReady?: boolean;
  error?: string;
}) => {
  const current_path = usePathname();
  return (
    <div className="w-full flex mt-5 gap-2 items-center  flex-col">
      <div className="w-full flex mt-5 gap-2 items-center ">
        <Button disabled={disabled} className=" w-[65%] relative ">
          {text}
          {children}
        </Button>
        <span >
        <NextLink href={`${isReady ? `${current_path.replace("images", "")}${url}` : ""}`}/>
        </span>
      </div>
      {error && <p className="text-red-500 ">{error}</p>}
    </div>
  );
};

export default NextStep;
