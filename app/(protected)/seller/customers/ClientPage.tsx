"use client";
import React, { useTransition } from "react";
import { columns } from "./Columns";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useGetOrders } from "@/app/queries/queries";
import { usePage } from "@/app/context/PageContext";
import { SkeletonTable } from "@/app/components/TableSkeleton";
import { DataTable } from "@/app/components/DataTable";
import MiniSpinner from "@/app/components/MiniSpinner";
import { deleteOrder } from "@/app/actions/pay";

const ClientPage = ({ id }: { id: string }) => {
  const { page, query, filter } = usePage();
  const { data, isLoading, isError } = useGetOrders(page, true);
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const handleDeleteAll = async (ids: string[]) => {
    startTransition(async () => {
      const res = await Promise.all(ids.map((id) => deleteOrder(id)));
      //@ts-ignore
      queryClient.invalidateQueries(["orders"]);
      if (res.every((r) => r)) {
        toast.success("orders deleted successfully");
      }
    });
  };
  return (
    <>
      <h1 className="font-bold py-2 px-4 capitalize">Here You can find all the orders to your products </h1>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          handleDeleteAll={handleDeleteAll}
          page={page || 1}
          totalPages={data?.totalPages || 1}
          data={data?.orders}
          columns={columns}
        />
      )}

      {isPending && <MiniSpinner />}
    </>
  );
};

export default ClientPage;
