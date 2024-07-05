import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-toastify";

const NotificationSender = ({ userId, productId }: { userId: string; productId: string }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
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
    socket.on("sentNotification", (data) => {
      console.log(data);
      toast.success(data.message);
    });
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
  return (
    <Button
      type="button"
      variant="default"
      onClick={() =>
        socket.emit("sendNotification", {
          userId,
          productId,
          message: "Product is waiting for confirmation from the admin",
        })
      }
      className="hover:text-red-100 duration-200 flex items-center gap-2 w-fit self-end"
    >
      <Link href={`/congrats`}>Finish Product ! </Link>
    </Button>
  );
};

export default NotificationSender;
