"use client";
import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Footer = () => {
  const pathName = usePathname();
  const paths = [ "/verify-email", "/signin", "/signup"];
  const session = useSession();
  return (
    <footer className=" bg-white flex-grow-0 ">
      <MaxWidthWrapper>
        <div className=" border-t border-gray-200">
          {paths.includes(pathName) ? null : (
            <div className=" pb-8 pt-16">
              <div className=" flex justify-center">
                <Logo />
              </div>
            </div>
          )}
          {paths.includes(pathName) ? null : (
            <div>
              <div className=" relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                <div className=" absolute inset-0 rounded-lg  overflow-hidden ">
                  <div
                    aria-hidden="true"
                    className=" absolute bg-zinc-50 inset-0  bg-gradient-to-br bg-opacity-90
                        "
                  ></div>
                </div>
                <div className=" text-center  relative mx-auto max-w-sm">
                  <h3 className=" font-semibold text-gray-900">Become a seller </h3>
                  <p className=" mt-2 text-muted-foreground text-sm">
                    If you would like to sell high quality products, you can do so in minutes.{" "}
                    <Link
                      href={session ? "/seller" : "/signin?as=seller"}
                      className=" whitespace-nowrap font-medium  text-black
                     hover:text-zinc-900 duration-150 underline"
                    >
                      Get started &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className=" py-10 md:flex md:items-center md:justify-between">
            <div className=" text-center md:text-left">
              <p className=" text-sm text-muted-foreground">
                {" "}
                &copy; {new Date().getFullYear()} All rights reserved. Shinobi Shop
              </p>
            </div>
          </div>
          <div className=" mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link href="#" className=" text-sm text-muted-foreground hover:text-gray-600">
                Privacy Policy
              </Link>
              <Link href="#" className=" text-sm text-muted-foreground hover:text-gray-600">
                Terms
              </Link>
              <Link href="#" className=" text-sm text-muted-foreground hover:text-gray-600">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
