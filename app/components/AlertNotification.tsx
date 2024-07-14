"use client";
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const AlertNotification = ({ message }: { message: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 15000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.5, type: "tween", ease: "easeIn" }}
          className="fixed bottom-10 right-10 max-w-[30rem] w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div className="p-4 flex items-start">
            <div className="flex-shrink-0 relative h-14 w-14">
              <Image src="/logo.png" className="absolute object-cover" alt="logo" fill />
            </div>

            <div className="ml-3">
              <AlertTitle className="text-sm font-medium text-gray-900">Hey There!</AlertTitle>
              <AlertDescription className="mt-1 text-sm text-gray-500">{message}</AlertDescription>
            </div>
            <div className="ml-4 mt-auto self-end flex-shrink-0 flex">
              <Button
                variant="ghost"
                onClick={() => setVisible(false)}
                className="ml-auto hover:text-amber-500 duration-150 text-xs"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertNotification;
