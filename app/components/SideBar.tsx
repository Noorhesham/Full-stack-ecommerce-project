import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits, MdSell } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { MdOutlineSell } from "react-icons/md";
import NavLink from "./NavLink";
import Logo from "./Logo";
import UserCard from "./UserCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SideMobileNav from "./SideMobileNav";

const SiderBar = async () => {
  const data = await getServerSession(authOptions);
  const isAdmin = data?.user?.isAdmin;
  return (
    <>
      <SideMobileNav isAdmin={isAdmin} data={data} />
      <section className="  lg:block hidden  h-full bg-white col-span-[3/4] text-left md:col-span-1 p-2  min-h-[100vh]">
        <div className="lg:flex  hidden h-full  flex-col items-center md:items-start md:ml-4 gap-2">
          <div className="flex flex-col items-center mx-auto ">
            <Logo />
          </div>
          <h4 className=" text-gray-400 md:text-xl text-sm ">Menu</h4>
          <NavLink href={`${data && isAdmin ? "admin" : "seller"}`} title="Seller Home" icon={<IoHomeOutline />} />
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
          <NavLink href={`${data && isAdmin ? "admin" : "seller"}/orders`} title="My Orders" icon={<MdOutlineSell />} />
          <h4 className=" text-gray-400 p-2 md:text-xl text-sm ml-4 ">Create</h4>
          <NavLink
            href={`${data && isAdmin ? "admin" : "seller"}/create-product`}
            title="Sell New Product"
            icon={<MdSell />}
          />
          {data?.user && (
            <div className=" mx-auto mb-10 mt-auto ">
              <UserCard user={data?.user} />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SiderBar;
