"use client";

import { ProductProps } from "@/app/types";
import { calculateFinalPrice, formatPrice, formattedDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { OrderProps } from "@/app/(home)/thank-you/page";
import CartContent from "@/app/components/CartContent";
import { Sheet } from "@/components/ui/sheet";
import ModelCustom from "@/app/components/ModelCustom";
import UpdateOrderStatus from "@/app/components/UpdateOrderStatus";
import { formatDate } from "date-fns";

export const columns: ColumnDef<OrderProps>[] = [
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
    accessorKey: "id",
    header: "Order Id",
    cell({ row }) {
      return <div className=" text-xs font-medium">{row.original._id}</div>;
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell({ row }) {
      const productsData = row.original.products;
      return (
        <div className=" w-12 h-12 relative">
          {/*@ts-ignore*/}
          <Image src={productsData[0].productId?.images[0].imgUrl} fill alt="product image" className=" object-cover" />
        </div>
      );
    },
  },
  {
    accessorKey: "deleiverd",
    header: "Deleiverd",
    cell({ row }) {
      return (
        <div className=" p-1 text-xs text-center  text-orange-600 rounded-xl font-medium">
          {row.original.isDelieverd ? `Deleiverd at ${formatDate(row.original.deliveredAt, "dd-MM-yyyy")}` : "Not Delieverd"}
        </div>
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Ordered At
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
      const products = row.original.products;
      const items = products.map((product: any) => {
        return { ...product.productId, variants: product.variants };
      });
      const cartTotal = items?.reduce((acc: number, { price, isOnSale, salePrice, variants, variations }: any) => {
        const finalPrice = calculateFinalPrice(price, variants, variations);
        return acc + (isOnSale ? finalPrice - +salePrice.replace("$", "") : finalPrice);
      }, 0);
      {
        return (
          <div className="flex flex-col items-start">
            <ModelCustom
              value={"Update Status"}
              title="Update Status"
              text="Update the status of this order"
              btn={<Button disabled={row.original.isDelieverd} variant="ghost">Update Status</Button>}
              content={<UpdateOrderStatus order={row.original} />}
            />
            <Sheet>
              <CartContent
                location={row.original.location}
                showOnly
                cart={items}
                fee={1}
                cartTotal={cartTotal}
                itemsCount={items.length}
              />
            </Sheet>
          </div>
        );
      }
    },
  },
];
