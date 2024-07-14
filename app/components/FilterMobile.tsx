"use client";
import React from "react";
import { FaFilter } from "react-icons/fa";
import Filters from "./Filters";
import Sort from "./Sort";

const FilterMobile = ({ onlyPrice }: { onlyPrice?: boolean }) => {
  const [filterMobile, setFilterMobile] = React.useState(false);
  return (
    <div className=" w-full col-span-full">
      <div className="flex items-center gap-2  self-end  justify-end ml-auto">
        {" "}
        <button
          onClick={() => setFilterMobile(!filterMobile)}
          className=" lg:hidden block text-gray-400 text-xl hover:text-orange-400 duration-150 "
        >
          <FaFilter />
        </button>
        <Sort />
      </div>

      {filterMobile && <Filters onlyPrice={onlyPrice} />}
    </div>
  );
};

export default FilterMobile;
