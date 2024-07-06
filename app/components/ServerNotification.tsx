import React from "react";
import Notifications from "./Notifications";
import connect from "@/lib/database/connect";
import { UserProps } from "@/lib/database/models/UserModel";
import { fetchNotifications } from "../actions/products";

const ServerNotification = async ({ user }: { user: UserProps & any }) => {
  await connect();
  const notifications = await fetchNotifications(user);
  return <Notifications isAdmin={user?.isAdmin || false} userId={user?.id || ""} notifications={notifications} />;
};

export default ServerNotification;
