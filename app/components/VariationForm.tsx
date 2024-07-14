"use client";

import React, { useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { uploadToCloudinary } from "@/lib/utils";
import { FancyMultiSelect } from "./MultiSelect";
import FormInput from "./InputField";
import ImageSmallInput from "./ImageSmallInput";
import { addVariants, deleteVariant, deleteVariantOption, deleteVariantOptionImage } from "../actions/products";
import { VariationProps, variationOptionsProps } from "../types";
import { CommandBox } from "./CommandBox";
import ModelCustom from "./ModelCustom";
import { Delete } from "./Delete";
import { variationSchema } from "../schemas/Schema";
import Image from "next/image";

interface VariationFormProps {
  removeVariation: () => void;
  productPrice: number;
  defaultVariation?: any;
  variants: VariationProps[];
  productId?: string;
  DeleteVariant: (id: string) => void;
}

const VariationForm: React.FC<VariationFormProps> = ({
  removeVariation,
  productPrice,
  defaultVariation,
  variants,
  productId,
  DeleteVariant,
}) => {
  const defaultOptions: any[] =
    defaultVariation?.variationOptions?.map((op: any) => ({
      price: op.price,
      images: op.images,
      _id: op.variationOption._id,
      variationOption: op.variationOption._id,
    })) || [];

  const form = useForm({
    resolver: zodResolver(variationSchema(productPrice)),
    defaultValues: {
      variation: defaultVariation?.variation?._id || "",
      variationOptions: defaultOptions,
    },
  });

  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  const router = useRouter();
  const { control, handleSubmit, formState, setValue, getValues } = form;
  const { fields, remove } = useFieldArray({
    control,
    name: "variationOptions",
  });
  const [options, setOptions] = useState<variationOptionsProps[]>([]);
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: z.infer<ReturnType<typeof variationSchema>>) => {
    try {
      startTransition(async () => {
        const updatedOptions = await Promise.all(
          data.variationOptions.map(async (option, index) => {
            if (!option.images) return option;
            const uploadedImages = await Promise.all(
              option.images.map((file: File | any) => {
                if (!(file instanceof File)) return file;
                return uploadToCloudinary(file, (progress) => {
                  setUploadProgress((prev) => ({ ...prev, [index]: progress }));
                });
              })
            );
            return {
              ...option,
              image: null,
              images: uploadedImages.map((img: any) => ({
                imgUrl: img.imgUrl || img.secure_url,
                publicId: img.publicId || img.public_id,
              })),
            };
          })
        );
        const res = await addVariants({ ...data, variationOptions: updatedOptions }, productId || "");
        if (res?.success) toast.success("Variants Added successfully");
        router.refresh();
      });
    } catch (error) {
      toast.error("Error updating product");
      console.error(error);
    }
  };

  const multi = options.map((option) => ({
    name: option.title,
    _id: option._id,
  }));

  const deleteOption = (variationId: string, variationOptionId: string) => {
    startTransition(async () => {
      const res = await deleteVariantOption(productId || "", variationId, variationOptionId);
      if (res?.success) toast.success("Variation deleted successfully");
      if (res?.error) toast.error(res?.error.message);
      router.refresh();
    });
  };

  const deleteImage = async ({
    variationId,
    variationOptionId,
    publicId,
  }: {
    variationId: string;
    variationOptionId: string;
    publicId: string;
  }) => {
    startTransition(async () => {
      const res = await deleteVariantOptionImage(productId || "", variationId, variationOptionId, publicId);
      if (res?.success) toast.success(res?.success);
      if (res?.error) toast.error(res?.error.message);
      router.refresh();
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col shadow-md bg-white rounded-2xl gap-8 px-8 py-4">
        <div className="flex flex-col items-start gap-2">
          <CommandBox setOptions={setOptions} label="Variation" options={variants} control={control} name="variation" />
          <FancyMultiSelect control={control} label="Options" options={multi} name="variationOptions" />
        </div>
        {fields.map((field, index) => (
          <ModelCustom
            text="Edit Option"
            title="Edit Option"
            key={field.id}
            content={
              <div className="flex flex-col py-8 px-4 border-gray-400 rounded-xl border items-start gap-2" key={index}>
                <FormInput
                  desc="The price for the variant will be added to the normal price .. if there is no specific  price 
                 add 0"
                  price
                  control={control}
                  optional={true}
                  className="w-full"
                  name={`variationOptions.${index}.price`}
                  label={`Price for ${multi.find((op) => op._id === field._id)?.name}`}
                  type="text"
                />
                <ImageSmallInput
                  progress={uploadProgress}
                  control={control}
                  args={{ variationId: options[index]?.variation, variationOptionId: field.variationOption }}
                  label={field.name}
                  deleteImage={deleteImage}
                  name={`variationOptions.${index}.images`}
                />
                <Delete
                  btn={
                    <Button disabled={isPending} className=" ml-auto my-4" variant={"destructive"}>
                      Delete
                    </Button>
                  }
                  value={"Variant Option"}
                  onClick={() => {
                    remove(index);
                    deleteOption(options[index].variation || "", field.variationOption);
                  }}
                />
              </div>
            }
            btn={
              <div>
                {multi
                  .filter((op) => op._id === field._id)
                  .map((op) => (
                    <div
                      key={op._id}
                      className="flex cursor-pointer hover:bg-rose-300 hover:text-gray-950 duration-150 w-full py-2 px-4  items-center gap-3"
                    >
                      {field.images && (
                        <Image
                          src={field.images?.[0]?.imgUrl}
                          alt="product image"
                          width={20}
                          height={20}
                          className="w-5 h-5 rounded-full"
                        />
                      )}
                      <p>{op.name}</p>
                    </div>
                  ))}
              </div>
            }
          />
        ))}
        <div className="flex gap-3 items-center self-end ml-auto">
          <Button disabled={isPending} className="" type="submit">
            Submit
          </Button>
          <Delete
            value={"Variation"}
            onClick={() => {
              removeVariation();
              DeleteVariant(defaultVariation?.variation?._id);
            }}
            btn={
              <Button disabled={isPending} variant={"destructive"}>
                Delete
              </Button>
            }
          />
        </div>
      </form>
    </Form>
  );
};

export default VariationForm;
