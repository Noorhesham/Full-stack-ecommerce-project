"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { UserProps } from "@/lib/database/models/UserModel";
import { signOut } from "next-auth/react";
import { Calendar, LayoutDashboard, LogOutIcon, Settings } from "lucide-react";
import Link from "next/link";
import { formattedDate } from "@/lib/utils";
import UserOptions from "./UserOptions";

const User = ({ user, className, open }: { user: UserProps | any; className?: string; open?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTriggerClick = () => {
    if (open) return;
    setIsOpen(!isOpen);
  };
  return (
    <HoverCard open={open ? false : isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger className="cursor-pointer" asChild>
        <div onClick={handleTriggerClick}>
          <Avatar className={`${className || ""}`}>
            <AvatarImage src={user.image || `${user.photo}` || "/avatar.jpg"} />
            <AvatarFallback>{user.firstName}</AvatarFallback>
          </Avatar>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <UserOptions user={user} />
      </HoverCardContent>
    </HoverCard>
  );
};

export default User;
