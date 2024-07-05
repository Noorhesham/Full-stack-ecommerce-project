import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

import ServerNotification from "./ServerNotification";
const Notification = require("../../lib/database/models/NotificationModel");
const AdminNav = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className=" flex items-center justify-between bg-white sticky z-50 py-3 px-10  top-0  inset-0 border-b border-gray-400">
      <div className="flex flex-col justify-center items-start">
        <h1 className="font-bold text-sm"> Hey There {session && session?.user?.firstName} !</h1>
        <p className="text-xs font-[400] mt-2 text-gray-400 text-muted-foreground">
          Here is what is happening with your store today
        </p>
      </div>

      <ServerNotification user={session?.user} />
    </div>
  );
};

export default AdminNav;
