"use client";
import React, { useEffect, useState, useTransition } from "react";
import { IoNotifications } from "react-icons/io5";
import { socket } from "../socket";
import AlertNotification from "./AlertNotification";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import MiniSpinner from "./MiniSpinner";
import NotificationItem from "./NotificationItem";
import Image from "next/image";
import { handleRead } from "../actions/products";

interface NoftificationsProps {
  message: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  productId: {
    name: string;
    _id: string;
  };
  isRead: boolean;
  _id: string;
  createdAt: Date;
}

const Notifications = ({
  notifications,

  userId,
  isAdmin,
}: {
  notifications: NoftificationsProps[];

  userId: string;
  isAdmin: boolean;
}) => {
  const [existingNotifications, setNotifications] = useState(notifications || []);
  const [popNotification, setPopNotification] = useState<NoftificationsProps | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    socket.emit("joinRoom", isAdmin ? "admin" : userId);

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      socket.on("sentNotification", (data: NoftificationsProps) => {
        console.log("sentNotification event received:", data);
        setNotifications((prev) => [data, ...prev]);
        setPopNotification(data);
        router.refresh();
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.on("AcceptProduct", (value) => {
        setNotifications((prev) => [value, ...prev]);
        setPopNotification(value);
        console.log("Product accepted:", value);
      });

      socket.on("statusOrderUpdate", (data) => {
        setNotifications((prev) => [data, ...prev]);
        setPopNotification(data);
        console.log("statusOrderUpdate", data);
      });
    }

    function onDisconnect() {
      socket.off("sentNotification");
      socket.off("AcceptProduct");
      socket.off("statusOrderUpdate");
      socket.off("connect");
      socket.off("disconnect");
    }

    return () => {
      onDisconnect();
    };
  }, []);

  const handleMouseEnter = async (id: string, isRead: boolean) => {
    if (!isRead) {
      setNotifications((prev) =>
        prev.map((notification) => (notification._id === id ? { ...notification, isRead: true } : notification))
      );

      try {
        await handleRead(id);
      } catch (error) {
        setNotifications((prev) =>
          prev.map((notification) => (notification._id === id ? { ...notification, isRead: false } : notification))
        );
      }
      router.refresh();
    }
  };
  const handleDeleteState = (id: string) => {
    setNotifications([...existingNotifications.filter((notification: any) => notification._id !== id)]);
  };
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-pointer relative p-2 bg-gray-100 hover:bg-gray-200 hover:text-rose-400 rounded-full duration-150">
            <IoNotifications className="w-6 h-6" />
            <span className="absolute top-1 -right-2 h-4 w-4 text-center my-auto rounded-full bg-orange-500 text-xs text-gray-50">
              {existingNotifications?.filter((notification) => !notification.isRead).length}
            </span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 max-h-80 overflow-y-auto">
          <h3 className="font-semibold">Notifications</h3>
          {existingNotifications?.length === 0 && (
            <div className="flex h-full flex-col items-center ">
              <div className=" w-40 relative h-40 ">
                <Image fill className="object-cover" src="/empty.jpg" alt="empty" />
              </div>
              <p className="text-sm text-center">No new notifications</p>
            </div>
          )}
          {existingNotifications.map((data) => (
            <NotificationItem
              key={data._id}
              handleDeleteState={handleDeleteState}
              data={data}
              handleMouseEnter={handleMouseEnter}
            />
          ))}
        </HoverCardContent>
      </HoverCard>
      {popNotification && <AlertNotification message={popNotification.message} />}
    </div>
  );
};

export default Notifications;
