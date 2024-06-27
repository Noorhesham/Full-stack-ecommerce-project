import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "./InputField";
import { Loader2, PlusIcon } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Delete } from "./Delete";
import { useGetCategories, useUpdateCategories } from "../queries/queries";
import SubForm from "./SubForm";
import MiniSpinner from "./MiniSpinner";
import { updateCategoryOrSub } from "../actions/categoryActions";
import { toast } from "react-toastify";

// Define your schema here
const categorySchema = z.object({
  name: z.string().nonempty("name is required"),
});

const EditForm = ({
  value,
  close,
  setValue,
}: {
  value: { name: string; _id: string; subCategories: { name?: string }[] };
  close: any;
  setValue?: any;
}) => {
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: value?.name || "",
    },
  });
  const [subcategory, setSubcategory] = React.useState([
    ...Array.from({ length: (value && value.subCategories?.length + 1) || 1 }, (_, i) => i),
  ]);
  const { update, isPending, isSuccess } = useUpdateCategories();
  const { handleSubmit, control } = form;
  const [upload, setUpload] = React.useState<any>(false);
  const onSubmit = async (data: any) => {
    if (value) update({ data, id: value?._id });
    else {
      const res = await updateCategoryOrSub(data).then((res: any) => {
        setValue(res.data.category);
        if (res.success) toast.success(res.success);
      });
      console.log(value);
    }
  };
  console.log(value);

  const handleDeleteSubCategory = async (index: number) => {
    if (!value._id) return;
    try {
      update({ data: null, id: value?._id, remove: true });
    } catch (error) {
      console.error("Failed to delete subcategory:", error);
    }
    close();
    setValue(null);
  };
  console.log(value);
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8 px-5 py-4">
        <FormInput control={control} className="w-full" name="name" label="Category Name" type="text" />
        <DialogFooter>
          <Button disabled={isPending} type="submit">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
      {value &&
        subcategory.map((field, index) => (
          <SubForm
            removeState={() => setSubcategory((sub) => sub.filter((_, i) => i !== index))}
            key={index}
            parentId={value?._id || upload?._id}
            value={value?.subCategories?.[index]}
          />
        ))}
      {subcategory.length < 4 && (
        <Button
          type="button"
          variant="ghost"
          className="hover:text-red-500 duration-200 flex items-center gap-2 w-fit self-end"
          onClick={() => setSubcategory((sub) => [...sub, subcategory.length + 1].filter((i) => i != undefined))}
        >
          <PlusIcon /> Add Subcategory
        </Button>
      )}
      {(value || upload) && (
        <Delete
          disabled={isPending}
          btn={
            <Button disabled={isPending} className="bg-red-500 hover:bg-red-400 duration-200 text-gray-50 ml-auto">
              {isPending ? <MiniSpinner /> : "Delete Category"}
            </Button>
          }
          onClick={handleDeleteSubCategory}
          value={value}
        />
      )}
    </Form>
  );
};

export default EditForm;
