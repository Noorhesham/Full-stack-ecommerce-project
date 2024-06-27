"use client";

import * as React from "react";
import { Edit } from "./Edit";
import { useGetCategories,  } from "../queries/queries";
import Loader from "./Loader";
import ComboSelect from "./ComboSelect";

export function ShowCategories() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { categories, isLoading } = useGetCategories();

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-4 ">
     <ComboSelect value={value} setValue={setValue} open={open} setOpen={setOpen} categories={categories}/>
      <div className="flex self-end items-center gap-2">
        <Edit setValue={setValue} create={true}  text="Add Category" className="ml-auto self-end" value={value||null} />
        {value && (
          <Edit setValue={setValue}
            text="Edit Category"
            className=" " create={false}
            value={categories?.find((option: any) => option._id === value)}
          />
        )}{" "}
      </div>
    </div>
  );
}
