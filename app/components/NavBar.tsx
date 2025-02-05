import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Logo from "./Logo";
import NavItems from "./NavItems";
import Cart from "./Cart";
import User from "./User";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ServerNotification from "./ServerNotification";
import SignButtons from "./SignButtons";
import MobileNav from "./MobileNav";

const NavBar = async () => {
  const data = await getServerSession(authOptions);
  return (
    <nav className=" bg-white sticky z-50  top-0  inset-0 h-16">
      <header className=" relative bg-white">
        <MaxWidthWrapper>
          <div className=" border-b border-gray-200">
            <div className=" flex h-16 items-center">
              <MobileNav  />
              <div className=" ml-4 flex lg:ml-0">
                <Logo />
              </div>
              <div className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
                <NavItems />
              </div>
              <div className=" ml-auto flex items-center">
                <div className=" flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {data?.user ? <User user={data.user} /> : <SignButtons />}
                  <div className=" ml-4 flex items-center justify-center text-center ">
                    <Cart />
                  </div>
                  {data?.user && (
                    <div className=" ml-4 flow-root lg:ml-6">
                      <ServerNotification user={data?.user} />
                    </div>
                  )}
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
