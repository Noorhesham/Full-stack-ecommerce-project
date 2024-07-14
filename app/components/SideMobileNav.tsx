"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnClickOutside } from "../hooks/useClickOutside";
import NavLink from "./NavLink";
import Logo from "./Logo";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits, MdOutlineSell, MdSell } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import UserCard from "./UserCard";

const slideIn = {
  hidden: { x: "-100%" },
  visible: { x: "0%" },
  exit: { x: "-100%" },
};

const SideMobileNav = ({ data, isAdmin }: { data: any; isAdmin?: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement | null>(null); // whenever we click an item in the menu and navigate away, we want to close the menu
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // when we click the path we are currently on, we still want the mobile menu to close,
  // however we cant rely on the pathname for it because that won't change (we're already there)
  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setIsOpen(false);
    }
  };
  useOnClickOutside(navRef, () => setIsOpen(false));
  // remove second scrollbar when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden  fixed left-3 top-3 z-[999999999] -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideIn}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />

            <div className="fixed overflow-y-scroll overscroll-y-none inset-0 z-40 flex">
              <motion.div
                className="w-4/5"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideIn}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div
                  ref={navRef}
                  className="relative h-full flex w-full max-w-sm flex-col overflow-y-auto bg-white pb-12 shadow-xl"
                >
                  <div className="flex px-4 pb-2 pt-5">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="lg:hidden  fixed left-3 top-24 z-[999999999] -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex h-full flex-col pt-20 lg:pt-5 items-start ml-4 gap-2">
                    <div className="flex flex-col items-center mx-auto ">
                      <Logo />
                    </div>
                    <h4 className="text-gray-400 md:text-xl text-sm">Menu</h4>
                    <NavLink
                      href={`${data && isAdmin ? "admin" : "seller"}`}
                      title="Seller Home"
                      icon={<IoHomeOutline />}
                    />
                    <NavLink
                      href={`${data && isAdmin ? "admin" : "seller"}/products`}
                      title="My Products"
                      icon={<MdOutlineProductionQuantityLimits />}
                    />
                    <NavLink
                      href={`${data && isAdmin ? "admin" : "seller"}/customers`}
                      title="My Customers"
                      icon={<BsPeople />}
                    />
                    <NavLink
                      href={`${data && isAdmin ? "admin" : "seller"}/orders`}
                      title="My Orders"
                      icon={<MdOutlineSell />}
                    />
                    <h4 className="text-gray-400 p-2 md:text-xl text-sm ml-4">Create</h4>
                    <NavLink
                      href={`${data && isAdmin ? "admin" : "seller"}/create-product`}
                      title="Sell New Product"
                      icon={<MdSell />}
                    />
                    {data?.user && (
                      <div className="">
                        <UserCard user={data?.user} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideMobileNav;
