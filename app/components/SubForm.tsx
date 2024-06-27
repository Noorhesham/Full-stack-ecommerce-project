"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useUpdateCategories } from "../queries/queries";
import OptionVariantForm from "./OptionVariantForm";

const subCategorySchema = z.object({
  name: z.string().nonempty("Subcategory name is required"),
  subCategories: z
    .array(
      z.object({
        name: z.string().nonempty("Subcategory name is required"),
      })
    )
    .optional(),
});

const SubForm = ({ value, removeState, parentId }: { value?: any; removeState: any; parentId: string }) => {
  const form = useForm({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: value?.name || "",
    },
  });
  const { isPending, update, isSuccess } = useUpdateCategories(true, value?._id);
  const { handleSubmit, control } = form;

  const onSubmit = async (data: any) => {
    const updatedData = { ...data, parentCategory: parentId };
    value ? update({ data: updatedData, id: value?._id }) : update({ data: updatedData });
  };

  const handleDeleteSubCategory = () => {
    value ? update({ data: null, id: value?._id, remove: true }) : removeState();
    if (isSuccess) {
      removeState();
    }
  };
  useEffect(() => {}, [isSuccess]);
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8 px-5 py-4">
        <OptionVariantForm
          name="name"
          label="Subcategory name"
          fn={handleDeleteSubCategory}
          value={value}
          isPending={isPending}
        />
      </form>
    </Form>
  );
};

export default SubForm;
