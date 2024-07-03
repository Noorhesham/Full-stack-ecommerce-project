"use client";
import { DataTable } from "@/app/components/DataTable";
import React from "react";
import { columns } from "./Columns";
import { useGetProducts } from "@/app/queries/queries";
import { usePage } from "@/app/context/PageContext";
import { SkeletonTable } from "@/app/components/TableSkeleton";
const ClientPage = () => {
  const { page, query, filter } = usePage();
  const { data, isLoading, isError } = useGetProducts(page, { search: query, category: filter });
  return (
    <> 
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable page={page || 1} totalPages={data?.totalPages||1} data={data?.products} columns={columns} />
      )}
    </>
  );
};

export default ClientPage;
