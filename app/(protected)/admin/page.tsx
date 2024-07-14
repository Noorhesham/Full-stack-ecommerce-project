import { CreateStripeAccount, getOrders } from "@/app/actions/pay";
import { getStats, getVariants } from "@/app/actions/products";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BarChartUsers from "@/app/components/BarChartUsers";
import CardWrapper from "@/app/components/CardWrapper";
import OrdersByDay from "@/app/components/OrdersByDay";
import PieChartProducts from "@/app/components/PieChartRevenue";
import { ShowCategories } from "@/app/components/ShowCategories";
import ShowVariants from "@/app/components/ShowVariants";
import StatsInfo from "@/app/components/StatsInfo";
import connect from "@/lib/database/connect";
import User from "@/lib/database/models/UserModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { FaBoxOpen, FaUsers } from "react-icons/fa6";
import { FcMoneyTransfer } from "react-icons/fc";
const Order = require("@/lib/database/models/OrderModel");
const page = async () => {
  await connect();
  const session = await getServerSession(authOptions);
  const user = await User.findById(session?.user.id);
  const stats: any = await getStats();
  if (!user.stripeAccountId) await CreateStripeAccount(user.email);
  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        totalSales: { $sum: "$totalPrice" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]).exec();
  const customers = await Order.aggregate([
    {
      $match: {
        sellers: new mongoose.Types.ObjectId(session.user.id),
      },
    },
    {
      $group: {
        _id: "$user",
        totalPaid: { $sum: "$totalPrice" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: "$userDetails._id",
        email: "$userDetails.firstName",
        totalPaid: 1,
      },
    },
    {
      $sort: { totalPaid: -1 },
    },
  ]).exec();
  const productRevenue = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        revenue: { $sum: "$totalPrice" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 1,
        revenue: 1,
        product: "$product.name",
      },
    },
  ]).exec();
  console.log(productRevenue);

  return (
    <section>
      <div className=" grid grid-cols-2 lg:grid-cols-4 px-10 py-4 gap-5 ">
        <StatsInfo icon={<FaBoxOpen />} text="Products" count={stats.productCount} />
        <StatsInfo icon={<FaUsers />} text="Users" count={stats.usersCount} />
        <StatsInfo
          icon={<FcMoneyTransfer />}
          text="Total Orders"
          count={orders.reduce((a: number, b: { count: number }) => a + b.count, 0)}
        />
        <StatsInfo icon={<FcMoneyTransfer />} text="customers ordered my products" count={customers.length} />
      </div>
      <div className=" px-10 py-4 gap-3 grid grid-cols-5 ">
        <div className=" col-span-3 ">
          <CardWrapper text="Recent Customers">
            <BarChartUsers data={customers} />
          </CardWrapper>
        </div>

        <div className="col-span-2">
          <CardWrapper text="Product Revenue">
            <PieChartProducts data={productRevenue} />
          </CardWrapper>
        </div>
        <div className=" col-span-2 ">
          <CardWrapper text="Recent Orders">
            <OrdersByDay data={orders} />
          </CardWrapper>
        </div>
        <div className="col-span-3 flex flex-col gap-5 ">
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
