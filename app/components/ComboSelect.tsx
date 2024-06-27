import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

const ComboSelect = ({
  value,
  setValue,
  open,
  setOpen,
  categories,
  placeholder,
  setFormDefaults,
  reset,
}: {
  value: any;
  setValue: any;
  open: boolean;
  setOpen: any;
  categories: any;
  placeholder?: string;
  setFormDefaults?: any;
  reset?: any;
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value
            ? categories.find((option: any) => option._id === value)?.name
            : `Select ${placeholder || "Category"}...`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className=" w-full">
          <CommandInput placeholder={`Search ${placeholder || "Category"} ...`} className="h-9 " />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {categories?.map((option: any) => (
                <CommandItem
                  key={option._id}
                  className="w-full cursor-pointer  "
                  value={option._id}
                  onSelect={(currentValue) => {
                    console.log("currentValue", currentValue, value, option);
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    if (setFormDefaults) {
                      if (currentValue === value) {
                        return reset();
                      }
                      setFormDefaults("name", option.name);
                      setFormDefaults("_id", currentValue);
                      option.variationOptions &&
                        option.variationOptions.forEach((option: any, i: number) => {
                          setFormDefaults(`subVariants.${i}.title`, option.title);
                          setFormDefaults(`subVariants.${i}._id`, option._id);
                        });
                      setFormDefaults("subVariants", option.variationOptions);
                    }
                  }}
                >
                  {option.name}
                  <CheckIcon className={cn("ml-auto h-4 w-4", value === option._id ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboSelect;
