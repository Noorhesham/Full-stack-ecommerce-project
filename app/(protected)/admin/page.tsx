import { getStats, getVariants } from "@/app/actions/products";
import CardWrapper from "@/app/components/CardWrapper";
import { ShowCategories } from "@/app/components/ShowCategories";
import ShowVariants from "@/app/components/ShowVariants";
import StatsInfo from "@/app/components/StatsInfo";
import React from "react";
import { FaBoxOpen, FaUsers } from "react-icons/fa6";
import { FcMoneyTransfer } from "react-icons/fc";

const page = async () => {
  const stats: any = await getStats();
  return (
    <section>
      <div className=" grid grid-cols-4 px-10 py-4 gap-5 ">
        <StatsInfo icon={<FaBoxOpen />} text="Products" count={stats.productCount} />
        <StatsInfo icon={<FaUsers />} text="Users" count={stats.usersCount} />
        <StatsInfo icon={<FcMoneyTransfer />} text="Completed Orders" count={stats.usersCount} />
        <StatsInfo icon={<FcMoneyTransfer />} text="Completed Orders" count={stats.usersCount} />
      </div>
      <div className=" px-10 py-4 grid grid-cols-4 ">
        <div className=" col-span-2 "></div>
        <div className="col-span-2 flex flex-col gap-5 ">
          <CardWrapper text="Categories List">
            <ShowCategories />
          </CardWrapper>
          <CardWrapper text="Varitants List">
            <ShowVariants />
          </CardWrapper>
        </div>
      </div>
    </section>
  );
};

export default page;
