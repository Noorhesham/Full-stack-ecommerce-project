"use client";

import { ProductProps } from "@/app/types";
import { formatPrice, formattedDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CopyIcon, MoreHorizontal, PenIcon } from "lucide-react";
import { Delete } from "@/app/components/Delete";
import { deleteProduct } from "@/app/actions/products";
import Link from "next/link";
import { toast } from "react-toastify";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { ImBin2 } from "react-icons/im";
import { useQueryClient } from "@tanstack/react-query";
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
      return <Image src={row.getValue("images")[0]} height={35} width={35} alt="product image" />;
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
      return <div className=" font-medium">{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      //@ts-ignore
      const queryClient = useQueryClient();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only hover:text-gray-400 duration-200">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer text-sm flex justify-between hover:text-green-400 duration-150"
              onClick={() => navigator.clipboard.writeText(product._id)}
            >
              Copy Product Id <CopyIcon className="h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer w-full text-sm "
              onClick={() => navigator.clipboard.writeText(product._id)}
            >
              <Link
                className="flex justify-between w-full   hover:text-green-400 duration-150"
                href={`/create-product/${product._id}`}
              >
                Edit <PenIcon className="h-4 w-4 ml-auto" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <Delete
              btn={
                <div className="flex px-3 py-1.5 hover:bg-gray-100 duration-150 justify-between cursor-pointer">
                  Delete{" "}
                  <span className=" hover:text-red-500  my-auto  self-center cursor-pointer text-red-400 duration-200  ">
                    <ImBin2 />
                  </span>
                </div>
              }
              value={product.name}
              onClick={async () => {
                const res = await deleteProduct(product._id);
                if (res.success) toast.success(res.success);
                //@ts-ignore
                queryClient.invalidateQueries("products");
              }}
            />
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
