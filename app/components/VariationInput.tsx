import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImBin2 } from "react-icons/im";

const VariationInput = ({
  index,
  register,
  errors,
  remove,
}: {
  index: number;
  register: any;
  errors: any;
  remove: any;
}) => {
  return (
    <>
      <FormItem className="flex  flex-col text-left w-full items-start  relative">
        <FormLabel className=" mr-auto self-start text-left">Variation Name</FormLabel>
        <FormControl>
          <div className=" relative w-full ">
            <Input
              className=" w-full"
              {...register(`variations.${index}.name` as const)}
              placeholder="Variation Name"
            />
            {remove && (
              <span
                className=" hover:text-red-500 top-1/2 -translate-y-1/2 right-3   absolute cursor-pointer text-red-400 duration-200  self-end"
                onClick={() => remove(index)}
              >
                <ImBin2 />
              </span>
            )}
          </div>
        </FormControl>
        {errors.variations?.[index]?.name && <FormMessage>{errors?.variations[index]?.name?.message}</FormMessage>}
      </FormItem>
    </>
  );
};

export default VariationInput;
