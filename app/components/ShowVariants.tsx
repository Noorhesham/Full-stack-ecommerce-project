"use client";
import { Form } from "@/components/ui/form";
import React, { useEffect, useTransition } from "react";
import FormInput from "./InputField";
import { useFieldArray, useForm } from "react-hook-form";
import ComboSelect from "./ComboSelect";
import { useGetVariants } from "../queries/queries";
import { Button } from "@/components/ui/button";
import { CreateVariant, DeleteVariant } from "../actions/categoryActions";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import BabySpinner from "./BabySpinner";
import OptionVariantForm from "./OptionVariantForm";
import { PlusIcon } from "lucide-react";
import { Delete } from "./Delete";

export const variantSchema = z.object({
  name: z.string().min(1, { message: "name must be added" }),
  _id: z.string().optional(),
  subVariants: z
    .array(
      z.object({
        title: z.string().min(1, { message: "name must be added" }),
        _id: z.string().optional(),
      })
    )
    .optional(),
});

const ShowVariants = () => {
  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      name: "",
      _id: "",
      subVariants: [],
    },
  });
  const queryClient = useQueryClient();
  const { variants, isLoading } = useGetVariants();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [isPending, startTransition] = useTransition();
  const { handleSubmit, reset, setValue: setFormValue, getValues } = form;
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    name: "subVariants",
  });

  const onSubmit = async (data: any) => {
    startTransition(async () => {
      const res: any = await CreateVariant(data);
      if (res.success) {
        toast.success(res.success);
        setValue(res.data.variant._id);
        //@ts-ignore
        queryClient.invalidateQueries("variants");
      } else {
        toast.error(res.error.message);
      }
    });
  };

  const handleDelete = async (id: string, sub = false) => {
    startTransition(async () => {
      const res: any = await DeleteVariant(id, sub);
      if (res.success) {
        toast.success(res.success);
        //@ts-ignore
        queryClient.invalidateQueries("variants");
        if (!sub) {
          reset();
          setValue("");
        }
      } else {
        toast.error(res.error.message);
      }
    });
  };

  useEffect(() => {
    const selectedVariant = variants?.find((variant: any) => variant._id === value);
    if (selectedVariant) {
      setFormValue("name", selectedVariant.name);
      setFormValue("_id", selectedVariant._id);
      selectedVariant.variationOptions?.forEach((option: any, i: number) => {
        setFormValue(`subVariants.${i}.title`, option.title);
        setFormValue(`subVariants.${i}._id`, option._id);
      });
    }
  }, [value, setFormValue, variants]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-5">
      <ComboSelect
        placeholder="Variant"
        value={value}
        setFormDefaults={setFormValue}
        setValue={setValue}
        open={open}
        reset={reset}
        setOpen={setOpen}
        categories={variants}
      />
      <Form {...form}>
        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          <FormInput className="w-full" control={form.control} label="Variant Name" name="name" />
          {value &&
            fields.map((field, index) => (
              <OptionVariantForm
                key={field.id}
                name={`subVariants.${index}.title`}
                label="Sub Variant Name"
                fn={() => {
                  handleDelete(getValues(`subVariants.${index}._id`)||"", true);
                  remove(index);
                }}
                value={field}
                isPending={isPending}
              />
            ))}
          <div className="flex gap-2 ml-auto self-end">
            <Button className="ml-auto self-end" disabled={isPending} type="submit">
              {isPending ? <BabySpinner /> : value ? "Edit Variant" : "Add Variant"}
            </Button>
            {value && (
              <Delete
                value={"this variant"}
                disabled={isPending}
                onClick={() => handleDelete(value)}
                btn={<Button variant="destructive">Delete Variant</Button>}
              />
            )}
          </div>
        </form>
        {fields.length < 4 && value && (
          <Button
            type="button"
            variant="ghost"
            className="hover:text-red-500 duration-200 flex items-center gap-2 w-fit self-end"
            onClick={() => append({ title: "", _id: "" })}
          >
            <PlusIcon /> Add Option
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ShowVariants;
