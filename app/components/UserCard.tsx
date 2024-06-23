import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProps } from "@/lib/database/models/UserModel";
import Link from "next/link";
import React from "react";

const UserCard = ({ user }: { user: UserProps }) => {
  return (
    <Link href={`/profile/${user._id}`} className="flex gap-4">
      <Avatar>
        <AvatarImage src={`${user.photo}` || "/avatar.jpg"} />
        <AvatarFallback>{user.firstName}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-sm items-start gap-1">
        <h1 className="font-bold">{user.firstName}</h1>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>
    </Link>
  );
};

export default UserCard;
