"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RxCaretSort } from "react-icons/rx";
import { CheckIcon } from "lucide-react";
import { FormField, FormItem, FormDescription, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

export function CommandBox({
  name,
  control,
  setOptions,
  className,
  defaultValue,
  label,
  options = [],
}: {
  name: string;
  control: any;
  className?: string;
  defaultValue?: string;
  setOptions?: any;
  label?: string;
  options: any[];
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { getValues } = useFormContext();
  React.useEffect(() => {
    if (getValues(name)) {
      const variant = options.find((option) => option._id === getValues(name));
      console.log(variant);
      variant.variationOptions?.length>0&&setOptions([...variant?.variationOptions]);
    }
  }, [getValues, name, options, setOptions]);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("mr-auto self-start mb-4", className)}>
          {/* <FormLabel className="mr-4">{label ? "Category" :  label }</FormLabel> */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                {field.value
                  ? options.find((option) => option._id === field.value)?.name
                  : label
                  ? `Select ${label} ...`
                  : "Select category..."}
                <RxCaretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search category..."
                  className="h-9"
                  value={searchTerm}
                  //@ts-ignore
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {options
                      ?.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((option, index) => (
                        <CommandItem
                          key={index}
                          value={option._id}
                          onSelect={(currentValue: any) => {
                            const newValue = currentValue === field.value ? "" : option._id;
                            setSearchTerm("");
                            field.onChange(newValue);
                            setOptions && setOptions(option.variationOptions);
                            setOpen(false);
                          }}
                        >
                          {option.name}
                          <CheckIcon
                            className={cn("ml-auto h-4 w-4", field.value === option._id ? "opacity-100" : "opacity-0")}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* <FormDescription className="text-sm">Select {label ? label : "category"} for the project.</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
