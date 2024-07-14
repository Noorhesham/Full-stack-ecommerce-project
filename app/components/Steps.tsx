"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useGetProduct } from "../queries/queries";
import Link from "next/link";
import Image from "next/image";
import { ProductProps } from "../types";
import { useSession } from "next-auth/react";

const Steps = ({ id, product }: { id?: string; product?: ProductProps }) => {
  const pathname = usePathname();
  const user = useSession().data?.user;
  const STEPS = [
    {
      name: "Step 1: Add starter info",
      description: "Add your product info , name , description and more",
      url: id
        ? `/${user?.isAdmin ? "admin" : "seller"}/create-product/${id}`
        : `/${user?.isAdmin ? "admin" : "seller"}/create-product`,
    },
    {
      name: "Step 2: Add image",
      description: "Choose an image for your Product",
      url: id ? `/${user?.isAdmin ? "admin" : "seller"}/create-product/${id}/images` : "",
    },
    {
      name: "Step 3: Summary",
      description: "Add variations and more",
      url:
        id && product && product?.images.length > 0
          ? `/${user?.isAdmin ? "admin" : "seller"}/create-product/${id}/last`
          : "",
    },
  ];
  return (
    <ol className="rounded-md bg-white lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
      {STEPS.map((step, i) => {
        let isDisabled = false;
        if (step.url === "") isDisabled = true;
        const isCurrent = pathname.endsWith(step.url);
        // i am chincking step 2 if  the current then 1 is completed , so in in step 3 if current then 2 is completed too
        const isCompleted = STEPS.slice(i + 1).some((step) => pathname.endsWith(step.url) && step.url !== "");
        const imgPath = `/add${i + 1}.png`;

        return (
          <li key={step.name} className="relative overflow-hidden lg:flex-1">
            <Link href={isDisabled ? "" : step.url}>
              <span
                className={cn(
                  "absolute left-0 duration-150 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full",
                  {
                    "bg-zinc-700": isCurrent,
                    " bg-orange-500": isCompleted,
                  }
                )}
                aria-hidden="true"
              />

              <span className={cn(i !== 0 ? "lg:pl-9" : "", "flex items-center px-6 py-4 text-sm font-medium")}>
                <span className="flex-shrink-0  h-20 w-20 relative">
                  <Image
                    fill
                    alt={step.name}
                    src={imgPath}
                    className={cn("flex object-contain items-center justify-center", {
                      "border-none": isCompleted,
                      "border-zinc-700": isCurrent,
                      grayscale: isDisabled,
                    })}
                  />
                </span>

                <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                  <span
                    className={cn("text-sm duration-200 font-semibold text-zinc-700", {
                      "text-yellow-500": isCompleted,
                      "text-zinc-700": isCurrent,
                    })}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-zinc-500">{step.description}</span>
                </span>
              </span>

              {/* separator */}
              {i !== 0 ? (
                <div className="absolute inset-0 hidden w-3 lg:block">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 12 82"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

export default Steps;
