"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProps } from "@/lib/database/models/UserModel";
import { formattedDate } from "@/lib/utils";
import { Calendar, LayoutDashboard, LogOutIcon, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import ModelCustom from "./ModelCustom";
import UserUpdateForm from "./UserUpdateForm";
import { useGetUserDetails } from "../queries/queries";
import Loader from "./Loader";

const UserOptions = ({ user, show = false }: { user: UserProps; show?: boolean }) => {
  const router = useRouter();
  const { data, isLoading } = useGetUserDetails();
  console.log(data?.data);
  return (
    <>
      <div className="flex flex-col gap-4 items-center justify-between space-x-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.image || `${user.photo.imgUrl}` || "/avatar.jpg"} />
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
      {show ? (
        <Link className=" text-center text-muted-foreground hover:underline duration-150 hover:text-orange-300" href={`/profile/${user._id}`}>Show Profile</Link>
      ) : (
        <div className="flex flex-col mt-5 text-right">
          {
            <div className="flex items-center flex-row-reverse duration-200 hover:dark:bg-slate-800 hover:bg-gray-200 py-2 px-4 rounded-xl cursor-pointer gap-3 text-gray-400">
              <LayoutDashboard />
              <Link className=" text-gray-800" href={`${user.isAdmin ? "/admin" : "/seller"}`}>
                {user.isAdmin ? "Admin" : "Seller"} Dashboard
              </Link>
            </div>
          }
          <ModelCustom
            title="Settings"
            text="View your profile"
            btn={
              <div className="flex items-center flex-row-reverse duration-200 hover:dark:bg-slate-800 hover:bg-gray-200 py-2 px-4 rounded-xl cursor-pointer gap-3 text-gray-400">
                <Settings />
                <p className=" text-gray-800">Settings</p>
              </div>
            }
            // @ts-ignore
            content={isLoading ? <Loader className=" h-40 w-40" /> : <UserUpdateForm userData={data?.data?.user} />}
          />
          <Button
            variant="ghost"
            onClick={async () => {
              await signOut();
              router.push("/");
              toast.success("Logged out successfully");
            }}
            className="flex items-end w-full  self-end text-right ml-auto justify-end duration-200 py-2 px-4 rounded-xl cursor-pointer gap-3"
          >
            <p className=" text-gray-800">Log out</p>
            <LogOutIcon />
          </Button>
        </div>
      )}
    </>
  );
};

export default UserOptions;
