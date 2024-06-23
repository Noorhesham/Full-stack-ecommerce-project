"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import VariationForm from "./VariationForm";
import { useGetVariants } from "../queries/queries";
import Loader from "./Loader";

const LastFormProduct = ({variations}:{variations?:any}) => {
  const { variants, isLoading } = useGetVariants();
  const form = useForm({
    defaultValues: {
      variations: !variations?[{ name: "", options: [{ title: "", image: "" }] }]:variations,
    },
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;

  // control: Required for useFieldArray to manage the form state.
  //register: Function to register inputs.

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({
    control,
    name: "variations",
  });
  return (
    <motion.div
      initial={{ x: 1000 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="container py-5 flex flex-col lg:px-0"
    >
      <div className="flex flex-col px-10 py-3 xl:pb-[1.6rem] items-center text-center">
        <div className="mx-auto w-full space-y-6">
          <div className="flex py-3 border border-gray-200  rounded-2xl px-5 bg-white justify-between items-center gap-10">
            <h1 className="text-2xl font-semibold text-left">Add variants and more info</h1>
            {variationFields.length < 4 && (
              <Button
                type="button"
                variant="ghost"
                className="hover:text-red-500 duration-200 flex items-center gap-2 w-fit self-end"
                onClick={() => appendVariation({ name: "", options: [{ title: "", image: "" }] })}
              >
                <PlusIcon /> Add Variation
              </Button>
            )}
          </div>
          {isLoading ? <Loader className="w-60 h-60" />:

         <div className="grid grid-cols-3 gap-4">
         {variationFields.map((variation, variationIndex) => (
            <VariationForm variants={variants}
              key={variation.id}
              defaultVariation={variations?.[variationIndex]}
              variationIndex={variationIndex}
              removeVariation={removeVariation}
            />
          ))}
         </div>}
        </div>
      </div>
    </motion.div>
  );
};

export default LastFormProduct;
