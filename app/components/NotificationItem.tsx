"use client";
import Link from "next/link";
import React, { useTransition } from "react";
import MiniSpinner from "./MiniSpinner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { handleDeleteNotification } from "../actions/products";

const NotificationItem = ({
  data,
  handleMouseEnter,
  handleDeleteState,
}: {
  data: any;
  handleMouseEnter: any;
  handleDeleteState: any;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
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
                handleDeleteState(data._id);
                startTransition(async () => {
                  await handleDeleteNotification(data._id);
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
  );
};

export default NotificationItem;
