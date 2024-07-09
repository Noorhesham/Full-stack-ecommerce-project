"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaSort } from "react-icons/fa";
const SORTS = [
  {
    sortName: "price",
    sortValue: "asc",
  },
  {
    sortName: "price",
    sortValue: "desc",
  },
] as const;
const Sort = () => {
  const [sort, setSort] = useState<{ sortName: string; sortValue: "asc" | "desc" }>();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  useEffect(() => {
    const sort = searchParams.get("sort");
    if (sort) {
      const [sortName, sortValue] = sort.split(":");
      //@ts-ignore
      setSort({ sortName, sortValue });
    }
  }, [searchParams]);
  const handleSort = ({ sortName, sortValue }: { sortName: string; sortValue: "asc" | "desc" }) => {
    const url = new URL(window.location.href);
    url.searchParams.delete("sort");
    url.searchParams.append("sort", `${sortName}:${sortValue}`);
    replace(url.toString(), { scroll: false });
    setSort({ sortName, sortValue });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto text-start flex gap-2 items-center">
            Sort By <FaSort />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {SORTS.map(({ sortName, sortValue }, i) => (
            <div key={`${sortName}-${sortValue} ${i}`}>
              <DropdownMenuCheckboxItem
                className="capitalize text-left text-sm"
                checked={sort?.sortName === sortName && sort?.sortValue === sortValue}
                onCheckedChange={() => handleSort({ sortName, sortValue })}
              >
                {sortValue === "desc" ? "Highest " : "Lowest "} {sortName}
              </DropdownMenuCheckboxItem>
              {i !== SORTS.length - 1 && <DropdownMenuSeparator />}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Sort;
