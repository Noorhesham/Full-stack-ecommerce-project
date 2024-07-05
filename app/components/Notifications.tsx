"use client";
import React, { startTransition, useEffect, useState, useTransition } from "react";
import { IoNotifications } from "react-icons/io5";
import { socket } from "../socket";
import AlertNotification from "./AlertNotification";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import BabySpinner from "./BabySpinner";
import MiniSpinner from "./MiniSpinner";
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
  handleRead,
  handleDelete,
}: {
  notifications: NoftificationsProps[];
  handleRead: (id: string) => void;
  handleDelete: (id: string) => void;
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [existingNotifications, setNotifications] = useState(notifications);
  const [popNotification, setPopNotification] = useState({} as NoftificationsProps);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("sentNotification", (data: NoftificationsProps) => {
      router.refresh();
      setNotifications((prev) => [data, ...prev]);
      setPopNotification(data);
      toast.success(data.message);
      console.log(data, existingNotifications, notifications, popNotification);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [existingNotifications]);
  const handleMouseEnter = async (id: string, isRead: boolean) => {
    if (!isRead) {
      setNotifications((prev) =>
        prev.map((notification) => (notification._id === id ? { ...notification, isRead: true } : notification))
      );

      try {
        await handleRead(id);
      } catch (error) {
        // Rollback the optimistic update if the server request fails
        setNotifications((prev) =>
          prev.map((notification) => (notification._id === id ? { ...notification, isRead: false } : notification))
        );
      }
      router.refresh();
    }
  };
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className=" cursor-pointer relative p-2 bg-gray-100 hover:bg-gray-200 hover:text-rose-400 rounded-full duration-150">
            <IoNotifications className="w-6 h-6" />
            <span className=" absolute top-1 -right-2 h-4 w-4 text-center my-auto rounded-full bg-red-500 text-xs text-gray-50">
              {notifications.map((notification) => !notification.isRead).length}
            </span>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80 max-h-80 overflow-y-auto">
          <h3 className="font-semibold ">Notifications</h3>
          {notifications.reverse()?.map((data) => (
            <div
              onMouseEnter={() => handleMouseEnter(data._id, data.isRead)}
              key={data.message}
              className={` ${
                data.isRead ? "bg-gray-100" : "bg-rose-100 hover:bg-rose-200"
              } duration-150 cursor-pointer flex flex-col mt-1 gap-4 py-1 px-2 rounded-lg items-center justify-between space-x-4`}
            >
              <div className="text-xs">
                {data.userId.firstName} {data.userId.lastName} uploaded a new product {`(${data.productId.name})`}
                <br />
                <p className="text-xs">{data.message}</p>
                <div className="flex flex-col items-center">
                  <Link
                    className="text-xs mr-auto text-red-400 hover:text-red-500 duration-150 
                 hover:underline"
                    href={`/products#${data.productId._id}`}
                  >
                    Approve it now
                  </Link>
                  <div className="flex items-center ml-auto">
                    <Button
                      onClick={() => {
                        startTransition(async () => {
                          await handleDelete(data._id);
                          router.refresh();
                        });
                      }}
                      variant={"ghost"}
                      className="ml-auto hover:text-red-500 duration-150 text-xs"
                    >
                      Dismiss
                    </Button>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(data.createdAt).toLocaleString([], {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  </div>
                  {isPending && <MiniSpinner />}
                </div>
              </div>
            </div>
          ))}
          {existingNotifications.length === 0 && <p className="text-sm text-center">No new notifications</p>}
        </HoverCardContent>
      </HoverCard>

      {popNotification && <AlertNotification message={popNotification.message} />}
    </div>
  );
};

export default Notifications;
