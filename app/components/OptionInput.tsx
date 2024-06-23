import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ImBin2 } from "react-icons/im";
import Image from "next/image";
import Bin from "./Bin";
import { Delete } from "./Delete";

const OptionFields = ({
  control,
  register,
  variationIndex,
  errors,
  defaultOption,
}: {
  control: any;
  register: any;
  variationIndex: number;
  errors: any;
  defaultOption: any;
}) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `options`,
  }); //we pass the control to it then we get useful functions to manupilate arr state
  const { setValue, getValues } = useFormContext(); //for the image file
  return (
    <>
      {optionFields.map((option, optionIndex) => (
        <div key={option.id} className="flex relative w-full items-center gap-2 mb-2">
          <FormField
            control={control}
            name={`options.${optionIndex}.title`}
            render={({ field }) => (
              <FormItem className="flex-1 flex-col items-start flex gap-1">
                <FormLabel className="text-left">Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={`Option ${optionIndex + 1} Title`} />
                </FormControl>
                {errors.variations?.[variationIndex]?.options?.[optionIndex]?.title && (
                  <FormMessage>{errors.variations[variationIndex].options[optionIndex].title?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`options.${optionIndex}.image`}
            render={({ field }) => (
              <FormItem className="flex-1 flex-col items-start flex gap-1">
                <FormLabel className="text-left ">Image </FormLabel>
                <FormControl>
                  <div className="flex w-full  items-center gap-1">
                    {getValues().options[optionIndex].image || (defaultOption && defaultOption[optionIndex]?.image) ? (
                      <div className="relative cursor-pointer  self-end mt-auto rounded-lg  w-full h-12">
                        <Image
                          alt="upload"
                          src={URL.createObjectURL(
                            getValues().options[optionIndex].image ||
                              (defaultOption && defaultOption[optionIndex]?.image)
                          )}
                          fill
                          className=" absolute rounded-lg  object-contain"
                        />
                        <Input
                          type="file"
                          className=" cursor-pointer opacity-0"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setValue(`options.${optionIndex}.image`, file);
                            }
                          }}
                          accept="image/*"
                        />
                      </div>
                    ) : (
                      <Input
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setValue(`options.${optionIndex}.image`, file);
                          }
                        }}
                        accept="image/*"
                      />
                    )}

                    {optionFields.length > 1 && <Delete value={option} onClick={()=>removeOption(optionIndex)} />}
                  </div>
                </FormControl>
                {errors.variations?.[variationIndex]?.options?.[optionIndex]?.image && (
                  <FormMessage>{errors.variations[variationIndex].options[optionIndex].image?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
      ))}

      {optionFields.length < 3 && (
        <Button type="button" onClick={() => appendOption({ title: "", image: "" })}>
          Add Option
        </Button>
      )}
    </>
  );
};

export default OptionFields;
