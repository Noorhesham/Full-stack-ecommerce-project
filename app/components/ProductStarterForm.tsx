"use client";
import React, { useState } from "react";
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
import { CategoriesField } from "./CategoriesField";
import { motion } from "framer-motion";
import NextStep from "./NextStep";
import { toast } from "react-toastify";
import { useGetCategories } from "../queries/queries";
import { Island_Moments } from "next/font/google";
import Loader from "./Loader";
const ProductStep1Form = ({ defaultValues }: { defaultValues?: any }) => {
  const { product } = defaultValues || {};
  const { categories, isLoading:isGetting } = useGetCategories();
  const user: any = useSession().data?.user;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof productStep1Schema>>({
    resolver: zodResolver(productStep1Schema),
    defaultValues: {
      name: (product&&product?.name) || "",
      description: product&&product?.description || "",
      category: product&&product?.category || "",
      price: product&&product?.price + "" || "$10.00",
      stock: product&&product?.stock + "" || "1",
    },
  });
  const { handleSubmit, control } = form;
  const onSubmit = async (data: z.infer<typeof productStep1Schema>) => {
    const updatedData = { ...data, price: data.price.replace("$", "") };
    try {
      setIsLoading(true);
      const res: any = await saveProductStep1(updatedData, user?.id, product ? product._id : "");
      console.log(res);
      const productId = res?.productObject?._id;
      product && router.refresh() 
      if (res.success) {
        toast.success(`Product ${product ? "Updated" : "Created"} successfully`);
        if(!product)router.push(`create-product/${res.data.productObject._id}/images`);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-8 px-5 py-4">
              <FormInput control={control} className=" w-full" name="name" label="Product Name" type="text" />
              <FormInput
                description
                control={control}
                className=" mt-5 w-full"
                name="description"
                label="Description"
                type="text"
              />
              {isGetting ? (
                <Loader />
              ) : (
                <CategoriesField options={categories} defaultValue={product?.category} name={"category"} control={control} />
              )}{" "}
              <div className="flex items-center gap-2">
                <FormInput price control={control} className="w-full" name="price" label="Price" type="text" />
                <FormInput control={control} className="w-full" name="stock" label="Stock" type="number" />
              </div>
              {product ? (
                <NextStep disabled={isLoading} url="/images" text="Update">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                </NextStep>
              ) : (
                <Button disabled={isLoading} className=" w-[65%] relative ">
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
