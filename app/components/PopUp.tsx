import React from "react";
import { motion } from "framer-motion";
import { Delete } from "./Delete";
const PopUp = ({ count, handleDelete }: { count: number; handleDelete: Function }) => {
  return (
    <motion.div
      transition={{ duration: 0.5, type: "tween", ease: "easeIn" }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className=" py-3 px-6 rounded-full fixed  hover:bg-rose-500 duration-200 cursor-pointer font-medium bg-rose-700  left-[43%] -translate-x-1/2 bottom-6 text-gray-50 z-50  flex items-center gap-5 "
    >
      <p>Delete All Elements ?</p>
      <span>{count} Selected</span>
      <Delete onClick={handleDelete} value={"Delete"} />
    </motion.div>
  );
};

export default PopUp;
