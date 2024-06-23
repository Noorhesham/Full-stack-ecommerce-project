"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit } from "./Edit";
import { useGetCategories } from "../queries/queries";
import Loader from "./Loader";

export function ShowCategories() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const { categories, isLoading } = useGetCategories();
  if (isLoading) return <Loader />;
  return (
    <div className="flex flex-col gap-4 ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {value ? categories.find((option: any) => option._id === value)?.name : "Select Category..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command className=" w-full">
            <CommandInput placeholder="Search framework..." className="h-9 " />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {categories?.map((option: any) => (
                  <CommandItem
                    key={option._id}
                    className="w-full cursor-pointer  "
                    value={option._id}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option.name}
                    <CheckIcon className={cn("ml-auto h-4 w-4", value === option._id ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex self-end items-center gap-2">
        <Edit text="Add Category" className="ml-auto self-end" value={null} />
        {value && (
          <Edit text="Edit Category" className=" " value={categories?.find((option: any) => option._id === value)} />
        )}{" "}
      </div>
    </div>
  );
}
