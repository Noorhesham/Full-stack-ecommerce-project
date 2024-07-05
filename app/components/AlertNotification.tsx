import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const AlertNotification = ({ message }: { message: string }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000); // 5 seconds before it disappears

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence key={message}>
      <motion.div
        initial={{ opacity: 0, x: 1000 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 1000 }}
        transition={{ duration: 0.5, type: "tween", ease: "easeIn" }}
        className="fixed bottom-10 right-20"
      >
        <Alert>
          <Terminal className="h-4 w-4" />
          <div className="flex flex-col">
            <AlertTitle>Hey There!</AlertTitle>
            <AlertDescription>{message}.</AlertDescription>
            <button onClick={() => setVisible(false)} className="mt-2 self-end bg-red-500 text-white px-3 py-1 rounded">
              Dismiss
            </button>
          </div>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertNotification;
