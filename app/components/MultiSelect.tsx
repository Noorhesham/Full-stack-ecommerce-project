"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

type Option = { name?: string; _id: string; title?: string };

interface FancyMultiSelectProps {
  options: Option[];
  name: string;
  defaults?: any[];
  label?: string;
  control: any;
  className?: string;
}

export function FancyMultiSelect({ options, name, label, className, control, defaults }: FancyMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const { setValue, getValues } = useFormContext();

  const handleUnselect = (framework: Option, selected: Option[], onChange: (value: Option[]) => void) => {
    const newValue = selected.filter((s) => s._id !== framework._id);
    setValue(name, newValue);
    onChange(newValue);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    selected: Option[],
    onChange: (value: Option[]) => void
  ) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          onChange(selected.slice(0, -1));
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        console.log(field);
        return (
          <FormItem className={cn("mr-auto flex flex-col  items-start  self-start ", className)}>
            <FormControl>
              <Command
                onKeyDown={(e) => handleKeyDown(e, field.value, field.onChange)}
                className="overflow-visible z-20 bg-transparent"
              >
                <div className="group z-20   w-64  rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <div className="flex flex-wrap gap-1">
                    {field.value &&
                      field?.value?.map((framework: Option) => (
                        <Badge className="flex items-center" key={framework._id} variant="secondary">
                          {framework.name || framework.title || options.find((o) => o._id === framework._id)?.name}
                          <button
                            className="ml-1 rounded-full flex items-center outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUnselect(framework, field.value, field.onChange);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => handleUnselect(framework, field.value, field.onChange)}
                          >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      ))}
                    <CommandPrimitive.Input
                      ref={inputRef}
                      value={inputValue}
                      onValueChange={setInputValue}
                      onBlur={() => setOpen(false)}
                      onFocus={() => setOpen(true)}
                      placeholder="Select ..."
                      className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="relative mt-2">
                  <CommandList>
                    {open && options?.length > 0 ? (
                      <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                        <CommandGroup className="h-full overflow-auto">
                          {options
                            ?.filter((option) => !field.value?.some((s: Option) => s._id === option._id))
                            .map((framework, index) => (
                              <CommandItem
                                key={framework._id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onSelect={() => {
                                  setInputValue("");
                                  const currentValue = getValues(name) || [];
                                  const newValue = [...currentValue, { ...framework, variationOption: framework._id }];
                                  setValue(name, newValue);
                                }}
                                className="cursor-pointer"
                              >
                                {framework.name || framework.title}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </div>
                    ) : null}
                  </CommandList>
                </div>
              </Command>
            </FormControl>
            <FormDescription className="text-sm">Select {label ? label : "category"} for the project.</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
