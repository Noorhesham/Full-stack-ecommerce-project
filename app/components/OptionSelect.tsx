import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Select from "react-select";
import { useFormContext } from "react-hook-form";
const OptionSelect = ({control,name,className,options,variationIndex}:{control:any,name:string,className?:string,options?:any[],variationIndex:number}) => {
    const {setValue,getValues}=useFormContext()
    console.log(getValues(`options.${variationIndex}`),options)
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("mr-auto self-start mb-4", className)}>
          <FormLabel className="mr-4">Category</FormLabel>
          <Select
            {...field}
            isMulti
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selected) => {
              console.log(selected,getValues(`options[${variationIndex}].title`))
              field.onChange(selected.title);
              setValue(`options[${variationIndex}]`,selected)}}
          />
          <FormDescription>Select the category for the project.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default OptionSelect;
