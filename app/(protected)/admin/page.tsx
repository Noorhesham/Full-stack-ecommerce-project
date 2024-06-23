import { getCategories, getProducts, getStats } from "@/app/actions/products";
import CardWrapper from "@/app/components/CardWrapper";
import { CategoriesField } from "@/app/components/CategoriesField";
import { ShowCategories } from "@/app/components/ShowCategories";
import StatsInfo from "@/app/components/StatsInfo";
import React from "react";
import { FaBoxOpen, FaUsers } from "react-icons/fa6";
import { FcMoneyTransfer } from "react-icons/fc";

const page = async () => {
  const categories = await getCategories();
  const stats: any = await getStats();
  console.log(categories);
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
        <div className="col-span-2 ">
          <CardWrapper text="Categories List">
            <ShowCategories  />
          </CardWrapper>
        </div>
      </div>
    </section>
  );
};

export default page;
