"use client";

import * as React from "react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RxCaretSort } from "react-icons/rx";
import { CheckIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

export function CategoriesField({
  name,
  control,
  className,
  defaultValue,
  options = [],
}: {
  name: string;
  control: any;
  className?: string;
  defaultValue?: string;
  options: { name: string; _id: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("mr-auto self-start mb-4", className)}>
          <FormLabel className="mr-4">Category</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
                {field.value ? options.find((option) => option.name === field.value)?.name : "Select category..."}
                <RxCaretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search category..."
                  className="h-9"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {options
                      ?.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((option) => (
                        <CommandItem
                          key={option._id}
                          value={option.name}
                          onSelect={(currentValue) => {
                            const newValue = currentValue === field.value ? "" : option.name;
                            setSearchTerm(""); // Clear the search term after selection
                            field.onChange(newValue); // Update the form field value
                            setOpen(false); // Close the popover after selection
                          }}
                        >
                          {option.name}
                          <CheckIcon
                            className={cn("ml-auto h-4 w-4", field.value === option.name ? "opacity-100" : "opacity-0")}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>Select the category for the project.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
