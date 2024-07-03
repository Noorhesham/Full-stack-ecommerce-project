import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
const OptionSelect = ({
  control,
  name,
  className,
  options,
}: {
  control: any;
  name: string;
  className?: string;
  options?: any[];
}) => {
  const { setValue, getValues } = useFormContext();
console.log(getValues(name))
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("mr-auto self-start mb-4", className)}>
          <div className="flex w-full gap-3 items-center">
            {options?.map((option, index) => (
              <div key={option._id} className="flex items-center gap-2 flex-1">
                <Button onClick={(c) =>{
                  console.log(c)
                  setValue(`${name}.${index}.variantOption`,option._id)
                }} type="button">
                  {option.title}
                </Button>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OptionSelect;
