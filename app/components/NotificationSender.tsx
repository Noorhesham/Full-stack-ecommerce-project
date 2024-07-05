import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";

const NotificationSender = ({ userId, productId }: { userId: string; productId: string }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  useEffect(() => {
    // Ensure proper connection to the socket server
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      socket.on("sentNotification", (data) => {
        console.log(data);
        toast.success(data.message);
      });

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }

    function onDisconnect() {
      socket.off("sentNotification");
      socket.off("connect");
      socket.off("disconnect");
    }

    return () => {
      onDisconnect();
    };
  }, []);

  return (
    <Button
      type="button"
      variant="default"
      onClick={() =>
        socket.emit(
          "sendNotification",
          {
            userId,
            productId,
            message: "Product is waiting for confirmation from the admin",
          },
          "admin"
        )
      }
      className="hover:text-red-100 duration-200 flex items-center gap-2 w-fit self-end"
    >
      <Link href={`/congrats`}>Finish Product ! </Link>
    </Button>
  );
};

export default NotificationSender;
