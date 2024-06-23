import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Bin from "./Bin";
import { ImBin2 } from "react-icons/im";

export function Delete({ value, className, onClick }: { value: any; className?: string; onClick: any }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className=" hover:text-red-500  my-auto  self-center cursor-pointer text-red-400 duration-200  ">
          <ImBin2 />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Confirmation !</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <p className=" text-accent-foreground text-gray-800">Are you sure you want to delete {value && value.name}?</p>
        <DialogFooter className="flex mt-5 items-center self-end ml-auto">
          <Button onClick={onClick} className="bg-red-500 hover:bg-red-400 duration-200 text-gray-50">
            Delete
          </Button>
          <DialogClose>
            <Button variant={"ghost"}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
