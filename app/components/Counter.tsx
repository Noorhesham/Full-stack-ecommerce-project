import { Button } from "@/components/ui/button";
import React from "react";
import { FaShoppingCart } from "react-icons/fa";

const Counter = ({
  onAdd,
  onDecrement,
  length,
  max,
}: {
  onAdd: any;
  onDecrement: any;
  length?: number;
  max: number;
}) => {
  const [count, setCount] = React.useState(length || 0);
  const handleClick = () => {
    if (count > 0) {
      setCount((c: number) => c + 1);
      onAdd();
    } else return;
  };
  const decrease = () => {
    if (count < 0) return;
    else {
      setCount((c: number) => c - 1);
      onDecrement();
    }
  };
  return (
    <div className="">
      {count > 0 && (
        <div className="flex w-fit my-5 items-center text-lg mr-auto border border-gray-400  px-2 py-1 font-semibold rounded-lg bg-gray-50 text-1  gap-4">
          <button className=" px-2   hover:text-gray-200 duration-150 rounded-lg " onClick={decrease}>
            -
          </button>
          <span className="font-semibold duration-200">{count}</span>
          <button
            disabled={count >= max}
            className=" px-2  hover:text-gray-200 duration-150 rounded-lg "
            onClick={handleClick}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default Counter;
