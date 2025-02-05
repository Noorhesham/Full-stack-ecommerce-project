import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CopyIcon, MoreHorizontal, PenIcon } from "lucide-react";
import Link from "next/link";
import { deleteProduct, toggleFeatured } from "../actions/products";
import { Delete } from "./Delete";
import { ImBin2 } from "react-icons/im";
import { toast } from "react-toastify";
import { ProductProps } from "../types";
import { useSession } from "next-auth/react";

const TableActionsComponent = ({ product }: { product: ProductProps }) => {
  const queryClient = useQueryClient();
  const {data}=useSession()
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
            href={`${data?.user.isAdmin ? "/admin" : "/seller"}/create-product/${product._id}`}
          >
            Edit <PenIcon className="h-4 w-4 ml-auto" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-sm flex justify-between hover:text-green-400 duration-150"
          onClick={() => navigator.clipboard.writeText(product._id)}
        >
          Copy Product Id <CopyIcon className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer w-full text-sm ">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as featured
            </label>
            <Checkbox
              defaultChecked={product.isFeatured}
              onCheckedChange={async (val: any) => {
                console.log(val);
                const res = await toggleFeatured(product._id, val);
                if (res) toast.success(res.success);
              }}
              id="terms"
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <Delete
          btn={
            <div className="flex px-3 py-1.5 hover:bg-gray-100 duration-150 justify-between cursor-pointer">
              Delete{" "}
              <span className=" hover:text-amber-500  my-auto  self-center cursor-pointer text-amber-400 duration-200  ">
                <ImBin2 />
              </span>
            </div>
          }
          value={product.name}
          onClick={async () => {
            const res = await deleteProduct(product._id);
            console.log(res)
            if (res.success) toast.success(res.success);
            //@ts-ignore
            queryClient.invalidateQueries("products");
          }}
        />
        <DropdownMenuItem>View payment details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActionsComponent;
