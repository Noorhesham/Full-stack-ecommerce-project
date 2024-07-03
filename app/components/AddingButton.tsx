import { PlusIcon } from "lucide-react";
import React from "react";

const AddingButton = ({ onClick, text }: { onClick?: any; text: string }) => {
  return (
    <span onClick={onClick} className="flex items-center gap-3  text-rose-400  cursor-pointer duration-200 my-3 hover:text-rose-500">
      <PlusIcon />
      {text}
    </span>
  );
};

export default AddingButton;
