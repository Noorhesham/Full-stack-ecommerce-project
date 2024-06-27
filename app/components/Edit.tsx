import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import EditForm from "./EditForm";
import { useState } from "react";

export function Edit({ value, className, text,setValue,create }: { value: any; className?: string; text: string, setValue:any,create?:boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={()=>create&&setValue(null)} className={className} variant="outline">
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you re done.</DialogDescription>
        </DialogHeader>
        <EditForm setValue={setValue} close={() => setOpen(false)} value={value} />
      </DialogContent>
    </Dialog>
  );
}
