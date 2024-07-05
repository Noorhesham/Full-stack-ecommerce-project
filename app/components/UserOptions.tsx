"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProps } from "@/lib/database/models/UserModel";
import { formattedDate } from "@/lib/utils";
import { Calendar, LayoutDashboard, Link, LogOutIcon, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

const UserOptions = ({ user }: { user: UserProps }) => {
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-between space-x-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.image || `${user.photo}` || "/avatar.jpg"} />
          <AvatarFallback>{user.firstName}</AvatarFallback>
        </Avatar>
        <div className="space-y-1 text-center">
          <h4 className="text-sm font-semibold hover:underline duration-200 cursor-pointer">
            {user.firstName} {user.lastName}
          </h4>
          <p className="text-sm">{user.email}</p>
          <div className="flex items-center pt-2">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">Joined{formattedDate(new Date(user.createdAt))}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-5 text-right">
        {!user.isAdmin &&<div className="flex items-center flex-row-reverse duration-200 hover:dark:bg-slate-800 hover:bg-gray-200 py-2 px-4 rounded-xl cursor-pointer gap-3 text-gray-400">
          <LayoutDashboard />
          { <Link className=" text-gray-800" href="/seller">Seller Dashboard</Link>}
        </div>}
        <div className="flex items-center flex-row-reverse duration-200 hover:dark:bg-slate-800 hover:bg-gray-200 py-2 px-4 rounded-xl cursor-pointer gap-3 text-gray-400">
          <Settings />
          <p className=" text-gray-800">Settings</p>
        </div>
        <button
          onClick={async () => await signOut()}
          className="flex items-center flex-row-reverse duration-200 hover:bg-red-500 hover:text-gray-50 py-2 px-4 rounded-xl cursor-pointer gap-3 text-gray-400"
        >
          <LogOutIcon />
          <p className=" text-gray-800">Log out</p>
        </button>
      </div>
    </>
  );
};

export default UserOptions;
