"use client";
import { UserProps } from "@/lib/database/models/UserModel";
import { useSession } from "next-auth/react";
import React from "react";

const AdminNav = () => {
  const { data } = useSession();
  return (
    <div className=" bg-white sticky z-50 py-3 px-10  top-0  inset-0 border-b border-gray-400">
      <div className="flex flex-col justify-center items-start">
        <h1 className="font-bold text-sm"> Hey There {data && data?.user?.firstName} !</h1>
        <p className="text-xs font-[400] mt-2 text-gray-400 text-muted-foreground">
          Here is what is happening with your store today
        </p>
      </div>
    </div>
  );
};

export default AdminNav;
