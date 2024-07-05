import React from "react";
import Notifications from "./Notifications";
const Notification = require("../../lib/database/models/NotificationModel");
import connect from "@/lib/database/connect";
import Product from "@/lib/database/models/ProductsModel";
import User, { UserProps } from "@/lib/database/models/UserModel";

const ServerNotification =  async ({ user }: { user: UserProps&any }) => {
  let notificationsQuery;
  notificationsQuery = user.isAdmin
    ? Notification.find({ isAdmin: true })
    : Notification.find({ userId: user?.id, isAdmin: false });
  const notifications = await notificationsQuery
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
    <Notifications
      isAdmin={user?.isAdmin || false}
      userId={user?.id || ""}
      handleDelete={handleDelete}
      handleRead={handleRead}
      notifications={notifications}
    />
  );
};

export default ServerNotification;
