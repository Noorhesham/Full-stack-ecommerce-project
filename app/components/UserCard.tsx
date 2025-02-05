import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProps } from "@/lib/database/models/UserModel";
import Link from "next/link";
import React from "react";
import ModelCustom from "./ModelCustom";
import UserOptions from "./UserOptions";

const UserCard = ({ user,noemail=false }: { user: UserProps | any,noemail?:boolean }) => {
  return (
    <ModelCustom title="Profile" text="View your profile"
      btn={
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={`${user.photo?.imgUrl}` || "/avatar.jpg"} />
            <AvatarFallback>{user.firstName}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm items-start gap-1">
            <h1 className="font-bold">{user.firstName}</h1>
            {!noemail&&<p className="text-xs text-gray-400">{user.email}</p>}
          </div>
        </div>
      }
      content={<UserOptions user={user} />}
    />
  );
};

export default UserCard;
