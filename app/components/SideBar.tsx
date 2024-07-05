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

const SiderBar = async () => {
  const data = await getServerSession(authOptions);
  const isAdmin = data?.user?.isAdmin ? "admin" : "seller";
  return (
    <section className="  h-full bg-white col-span-[3/4] text-left md:col-span-1 p-2  min-h-[100vh]">
      <div className="flex h-full  flex-col items-center md:items-start md:ml-4 gap-2">
        <div className="flex flex-col items-center mx-auto ">
          <Logo />
        </div>
        <h4 className=" text-gray-400 md:text-xl text-sm ">Menu</h4>
        <NavLink
          href={`${data && data?.user?.isAdmin ? "admin" : "seller"}`}
          title="Seller Home"
          icon={<IoHomeOutline />}
        />
        <NavLink
          href={`${isAdmin ? "admin" : "seller"}/products`}
          title="My Products"
          icon={<MdOutlineProductionQuantityLimits />}
        />
        <NavLink href={`${isAdmin ? "admin" : "seller"}/customers`} title="My Customers" icon={<BsPeople />} />
        <NavLink href={`${isAdmin ? "admin" : "seller"}/orders`} title="My Orders" icon={<MdOutlineSell />} />
        <h4 className=" text-gray-400 p-2 md:text-xl text-sm ml-4 ">Create</h4>
        <NavLink href={`${isAdmin ? "admin" : "seller"}/create-product`} title="Sell New Product" icon={<MdSell />} />
        {data?.user && (
          <div className=" mx-auto mb-10 mt-auto ">
            <UserCard user={data?.user} />
          </div>
        )}
      </div>
    </section>
  );
};

export default SiderBar;
