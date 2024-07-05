import React from "react";
import Notifications from "./Notifications";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import connect from "@/lib/database/connect";
import Product from "@/lib/database/models/ProductsModel";
import User from "@/lib/database/models/UserModel";
const Notification = require("../../lib/database/models/NotificationModel");
const AdminNav = async () => {
  await connect();
  const session = await getServerSession(authOptions);
  const notifications = await Notification.find({ userId: session?.user?.id })
    .populate({ path: "productId", model: Product, select: "name" })
    .populate({ path: "userId", model: User, select: "firstName lastName" })
    .lean();
  const handleRead = async (id: string) => {
    "use server";
    await Notification.findByIdAndUpdate(id, { isRead: true });
  };
  const handleDelete = async (id: string) => {
    "use server";
    await Notification.findByIdAndDelete(id);
  };
  return (
    <div className=" flex items-center justify-between bg-white sticky z-50 py-3 px-10  top-0  inset-0 border-b border-gray-400">
      <div className="flex flex-col justify-center items-start">
        <h1 className="font-bold text-sm"> Hey There {session && session?.user?.firstName} !</h1>
        <p className="text-xs font-[400] mt-2 text-gray-400 text-muted-foreground">
          Here is what is happening with your store today
        </p>
      </div>
      <Notifications handleDelete={handleDelete} handleRead={handleRead} notifications={notifications} />
    </div>
  );
};

export default AdminNav;
