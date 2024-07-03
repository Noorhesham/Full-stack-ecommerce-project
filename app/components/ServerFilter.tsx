"use client";
import React from "react";
import ComboSelect from "./ComboSelect";
import { useGetCategories } from "../queries/queries";
import Loader from "./Loader";
import { useSearchParams } from "next/navigation";
import { usePage } from "../context/PageContext";
import { Button } from "@/components/ui/button";

const ServerFilter = ({ server = false }: { server?: boolean }) => {
  const { categories, isLoading } = useGetCategories();
  const { handleFilter, filter } = usePage();
  const queryParams = useSearchParams();
  if (isLoading) return <Loader />;
  return (
    <div className="flex items-center gap-3">
      <Button variant={"outline"} onClick={() => (server ? (window.location.search = "&filter=''") : handleFilter(""))}>
        Reset
      </Button>
      <ComboSelect
        onChange={(val: string) => {
          if (server) window.location.search = `&filter=${val}`;
          else {
            handleFilter(val);
          }
        }}
        value={server ? `${queryParams.get("filter")}` : filter}
        categories={categories}
      />
    </div>
  );
};

export default ServerFilter;
