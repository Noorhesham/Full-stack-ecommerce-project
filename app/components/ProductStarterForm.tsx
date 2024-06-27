"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "./InputField";
import { useRouter } from "next/navigation";
import saveProductStep1 from "../actions/products";
import { productStep1Schema } from "../schemas/Schema";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {  CommandBox } from "./CommandBox";
import { motion } from "framer-motion";
import NextStep from "./NextStep";
import { toast } from "react-toastify";
import { useGetCategories } from "../queries/queries";
import Loader from "./Loader";
import { FancyMultiSelect } from "./MultiSelect";
const ProductStep1Form = ({ defaultValues }: { defaultValues?: any }) => {
  const { product } = defaultValues || {}; //if there is a default values then this will be an edit form
  const { categories, isLoading: isGetting } = useGetCategories(); // getting all categoreis data
  const user: any = useSession().data?.user; // to pass it to the product creator
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof productStep1Schema>>({
    resolver: zodResolver(productStep1Schema),
    defaultValues: {
      name: (product && product?.name) || "",
      description: (product && product?.description) || "",
      category: (product && product?.category?._id) || "",
      price: (product && product?.price + "") || "$10.00",
      stock: (product && product?.stock + "") || "1",
      subCategories: product?.subCategories || [],
    },
  });
  const { handleSubmit, control, getValues, formState, setValue } = form;

  useEffect(() => {
    if (product?.category?._id) {
      const category = categories?.find((cat: any) => cat._id === product.category._id);
      if (category) {
        setValue("category", category._id);
        setValue(
          "subCategories",
          product.category.subCategories.filter((sub: any) => product.subCategories.includes(sub._id))
        );
      }
    }
  }, [categories, product, setValue]);
  const onSubmit = async (data: z.infer<typeof productStep1Schema>) => {
    console.log(data);
    const updatedData = { ...data, price: data.price.replace("$", "") };
    try {
      setIsLoading(true);
      const res: any = await saveProductStep1(updatedData, user?.id, product ? product._id : "");
      product && router.refresh();
      if (res.success) {
        toast.success(`Product ${product ? "Updated" : "Created"} successfully`);
        if (!product) router.push(`create-product/${res.data.productObject._id}/images`);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const SubCategoriesIndex = categories?.findIndex((cat: any, i: number) => cat._id === getValues("category"));
  return (
    <motion.div
      initial={{ x: 1000 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="container py-5 flex flex-col items-center justify-center lg:px-0"
    >
      <div className="flex flex-col px-20 py-3 xl:pb-[1.6rem] rounded-2xl bg-white items-center text-center">
        <div className="mx-auto w-full  bg-white space-y-6">
          <h1 className="text-2xl font-semibold text-center">Create Product</h1>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className=" min-h-[450px]  flex w-full flex-col gap-8 px-5 py-4">
              <FormInput control={control} className=" w-full" name="name" label="Product Name" type="text" />
              <FormInput
                description
                control={control}
                className=" mt-5 w-full"
                name="description"
                label="Description"
                type="text"
              />
              <div className="flex items-center gap-4">
                {isGetting ? (
                  <Loader className=" w-24 h-24" />
                ) : (
                  <CommandBox options={categories} name={"category"} control={control} />
                )}
                {getValues("category") && (
                  <FancyMultiSelect
                    control={control}
                    label="Sub Categories"
                    options={categories?.[SubCategoriesIndex]?.subCategories}
                    name={`subCategories`}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <FormInput price control={control} className="w-full" name="price" label="Price" type="text" />
                <FormInput control={control} className="w-full" name="stock" label="Stock" type="number" />
              </div>
              {product ? (
                <NextStep disabled={isLoading} url="/images" text="Update">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                </NextStep>
              ) : (
                <Button type="submit" disabled={isLoading} className=" w-[65%] relative ">
                  Next{" "}
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductStep1Form;
