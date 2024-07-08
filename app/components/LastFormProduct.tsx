"use client";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import VariationForm from "./VariationForm";
import { VariationProps } from "../types";
import { useProduct } from "../context/ProductContext";
import { deleteVariant } from "../actions/products";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import NotificationSender from "./NotificationSender";
import Link from "next/link";

// i want to fetch all the variants with thier subs
// i want to get the variant for the product as a default value
// we make an array of the defauls to that if there is defaults it appeas with the ability to add or remove items in the array
//we will make an indvsual form for each variant and options
// now we want to sync the sub variants so that when i choose a certain variant i get its subs in a multi select box
const LastFormProduct = ({ variations, isNotified }: { variations: VariationProps[] | any; isNotified: boolean }) => {
  const { product } = useProduct();
  const form = useForm({
    defaultValues: {
      variations: !variations ? [{ name: "", options: [{ title: "", image: "" }] }] : product?.variations,
    },
  });
  const { control } = form;

  const {
    fields: variationFields,
    append: appendVariation,
    remove: removeVariation,
  } = useFieldArray({
    control,
    name: "variations",
  });
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const DeleteVariant = (id: string) => {
    startTransition(async () => {
      if (!product?._id) removeVariation();
      const res = await deleteVariant(product?._id || "", id);
      if (res?.success) toast.success("Variation deleted successfully");
      if (res?.error) toast.error(res?.error.message);
      router.refresh();
    });
  };

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
            <div className="flex self-end gap-4">
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
              {isNotified ? (
                <Button
                  type="button"
                  variant="default"
                  className="hover:text-red-100 duration-200 flex items-center gap-2 w-fit self-end"
                >
                  <a href={`/products#${product?._id}`}>Finish Updating Product ! </a>
                </Button>
              ) : (
                <NotificationSender userId={product?.creator || ""} productId={product?._id || ""} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {variationFields.map((variation, variationIndex) => (
              <VariationForm
                DeleteVariant={DeleteVariant}
                productId={product?._id}
                removeVariation={removeVariation}
                variants={variations}
                key={variationIndex} productPrice={product?.price||10}
                defaultVariation={
                  product && product?.variations?.length > 0 ? product?.variations?.[variationIndex] : []
                }
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LastFormProduct;
