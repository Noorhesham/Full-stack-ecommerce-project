import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import Logo from "./Logo";
import NavItems from "./NavItems";
import { buttonVariants } from "@/components/ui/button";
import Cart from "./Cart";
import User from "./User";
import { UserProps } from "@/lib/database/models/UserModel";

const NavBar = ({ user }: { user: UserProps | any }) => {
  return (
    <nav className=" bg-white sticky z-50  top-0  inset-0 h-16">
      <header className=" relative bg-white">
        <MaxWidthWrapper>
          <div className=" border-b border-gray-200">
            <div className=" flex h-16 items-center">
              {/* mobile nav */}
              <div className=" ml-4 flex lg:ml-0">
                <Logo />
              </div>
              <div className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
                <NavItems />
              </div>
              <div className=" ml-auto flex items-center">
                <div className=" flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? (
                    <User user={user} />
                  ) : (
                    <>
                      <Link
                        className={buttonVariants({ variant: "ghost", className: " text-xs sm:text-sm" })}
                        href={"/signin"}
                      >
                        Sign in
                      </Link>
                      <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                      <Link
                        className={buttonVariants({ size: "sm", className: " text-xs sm:text-sm" })}
                        href={"/signup"}
                      >
                        Create account
                      </Link>
                      <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                    </>
                  )}
                  <div className=" ml-4 flow-root lg:ml-6">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </nav>
  );
};

export default NavBar;
