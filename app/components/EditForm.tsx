import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "./InputField";
import { Loader2, PlusIcon } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Delete } from "./Delete";
import { useUpdateCategories } from "../queries/queries";

// Define your schema here
const categorySchema = z.object({
  name: z.string().nonempty("Category name is required"),
  subCategories: z.array(
    z.object({
      name: z.string().nonempty("Subcategory name is required"),
    })
  ),
});

const EditForm = ({ value }: { value: { name: string; _id: string; subCategories: { name: string }[] } }) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: value?.name || "",
      subCategories: value?.subCategories || [],
    },
  });
  const { update, isPending, isError } = useUpdateCategories();
  const { handleSubmit, control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });
  const onSubmit = async (data: any) => {
    console.log(data);
    value ? update({data,id:value?._id}) : update({data});
  };

  const handleDeleteSubCategory = async (index: number, ) => {
    try {
      update({data,id:value?._id})
      remove(index);
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8 px-5 py-4">
        <FormInput control={control} className="w-full" name="name" label="Category Name" type="text" />
        {fields.map((field, index) => (
          <div key={field.id} className="flex w-full justify-between items-center gap-4">
            <div className="w-full">
              <FormInput
                label={`Subcategory ${index + 1}`}
                control={control}
                className="w-full flex-grow"
                name={`subCategories.${index}.name`}
                type="text"
              />
            </div>
            <Delete value={field.name} onClick={() => handleDeleteSubCategory(index, value._id)} />
          </div>
        ))}
        <DialogFooter>
          <Button disabled={isPending} type="submit">
            {isPending ?  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
      {fields.length < 4 && (
        <Button
          type="button"
          variant="ghost"
          className="hover:text-red-500 duration-200 flex items-center gap-2 w-fit self-end"
          onClick={() => append({ name: "" })}
        >
          <PlusIcon /> Add Subcategory
        </Button>
      )}
    </Form>
  );
};

export default EditForm;
