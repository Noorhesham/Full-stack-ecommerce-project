"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { UserProps } from "@/lib/database/models/UserModel";
import { signOut } from "next-auth/react";
import { Calendar, LogOutIcon, Settings } from "lucide-react";
import Link from "next/link";
const User = ({ user }: { user: UserProps | any }) => {
  console.log(user);
  return (
    <HoverCard>
      <HoverCardTrigger className=" cursor-pointer" asChild>
        <Avatar>
          <AvatarImage src={user.image || `${user.photo}` || "/avatar.jpg"} />
          <AvatarFallback>{user.firstName}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col gap-4  items-center justify-between space-x-4">
          <Avatar className=" w-24 h-24">
            <AvatarImage src={user.image || `${user.photo}` || "/avatar.jpg"} />
            <AvatarFallback>{user.firstName}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-center">
            <h4 className="text-sm font-semibold hover:underline duration-200 cursor-pointer">
              {user.firstName} {user.lastName}
            </h4>
            <Link href={'/sell'}>Seller Dashboard</Link>
            <p className="text-sm">{user.email}</p>
            <div className="flex items-center pt-2">
              <Calendar className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">Joined December 2021</span>
            </div>
          </div>
        </div>
        <div className=" flex flex-col mt-5 text-right">
          <div className="flex items-center flex-row-reverse duration-200 hover:dark:bg-slate-800 hover:bg-gray-200 py-2 px-4 rounded-xl cursor-pointer gap-3 text-gray-400">
            <Settings />
            <p> Settings</p>
          </div>
          <button
            onClick={async () => await signOut()}
            className="flex items-center flex-row-reverse duration-200 hover:bg-red-500 hover:text-gray-50 py-2 px-4 rounded-xl cursor-pointer gap-3 text-gray-400"
          >
            <LogOutIcon/>
            <p> Log out</p>
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default User;
