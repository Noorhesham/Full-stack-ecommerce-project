import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import EditForm from "./EditForm";

export function Edit({
  value,
  className,
  text,
}: {
  value:any;
  className?: string;
  text: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <EditForm value={value} />
      </DialogContent>
    </Dialog>
  );
}
