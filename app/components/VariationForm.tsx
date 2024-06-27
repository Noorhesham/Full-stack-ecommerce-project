"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormLabel,  } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { variationSchema } from "../schemas/Schema";
import { useParams, useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/utils";
import { toast } from "react-toastify";
import OptionSelect from "./OptionSelect";
import { CommandBox } from "./CommandBox";

const VariationForm = ({
  variationIndex,
  removeVariation,
  defaultVariation,
  variants,
}: {
  variationIndex: number;
  removeVariation: any;
  defaultVariation: any;
  variants: any;
}) => {
  console.log(variants);

  const form = useForm({
    resolver: zodResolver(variationSchema),
    defaultValues: {
      name: defaultVariation?.name || "",
      options: defaultVariation?.options || [{ title: "", image: "" }],
    },
  });
  const { id } = useParams();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;
  useFieldArray({
    control,
    name: "options",
  });
  const uploadImageWithProgress = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append("upload_preset", "v7t8mt9o");
    formData.append("file", file);
    const data = await uploadToCloudinary(formData);
    return data;
  };
  const onSubmit = async (data: z.infer<typeof variationSchema>) => {
    const newOptions = await Promise.all(
      data.options.map(async (option, i) => {
        if (!option.image) return option;
        const image = await uploadImageWithProgress(option.image, i);
        return { ...option, image };
      })
    );
    const res = await createVariation({ ...data, options: newOptions }, id);
    if (res.success) toast.success("Variation added succssfully");
    if (res.error) toast.error(res.error.message);
    router.refresh();
    console.log(res);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col shadow-md bg-white rounded-2xl   gap-8 px-8 py-4"
      >
        <CommandBox options={variants} control={control} name="name" />

        <div className="ml-4 w-full flex flex-col items-end gap-2">
          <FormLabel className="text-left mr-auto">Options</FormLabel>
          <OptionSelect
            variationIndex={variationIndex}
            options={variants[variationIndex].variationOptions}
            control={control}
            name="options"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button className="w-[60%] mx-auto text-center" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VariationForm;
