"use client";

import { ProductProps } from "@/app/types";
import { formatPrice, formattedDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import TableActionsComponent from "@/app/components/TableActionsComponent";
import ModelCustom from "@/app/components/ModelCustom";
import SelectFormStatus from "@/app/components/SelectFormStatus";
export const columns: ColumnDef<ProductProps>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "images",
    header: "Images",
    cell({ row }) {
      //@ts-ignore
      return <Image src={row.getValue("images")[0]?.imgUrl} height={35} width={35} alt="product image" />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return (
        <div className=" p-1 text-xs text-center border border-gray-400 rounded-xl font-medium">
          {row.getValue("status")}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      return <div className=" font-medium">{formatPrice(row.getValue("price"))}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell({ row }) {
      console.log(row.getValue("createdAt"));
      return <div className=" font-medium">{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      {
        return (
          <div className="flex flex-col items-start">
            <TableActionsComponent product={product} />
            <ModelCustom
              btn={
                <div className="flex text-sm px-3 py-1.5 hover:bg-gray-100 duration-150 justify-between cursor-pointer">
                  Change Status
                </div>
              }
              title="Change Product Status"
              text="Change the status of this product"
              content={<SelectFormStatus product={product} />}
            />
          </div>
        );
      }
    },
  },
];
