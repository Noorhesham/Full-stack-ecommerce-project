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
import { ChevronRight, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { CategoriesField } from "./CategoriesField";

const ProductStep1Form = ({ defaultValues }: { defaultValues?: any }) => {
  const user: any = useSession().data?.user;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof productStep1Schema>>({
    resolver: zodResolver(productStep1Schema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      category: defaultValues?.categorey || "",
      price: defaultValues?.price || "10",
      stock: defaultValues?.stock || "1",
    },
  });
  const { handleSubmit, control } = form;
  const onSubmit = async (data: z.infer<typeof productStep1Schema>) => {
    console.log(data);
    try {
      setIsLoading(true);
      const res: any = await saveProductStep1(data, user?.id);
      const productId = res?.product._id;
      router.push(`create-product/${productId}/images`);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex sm:w-[50%] py-10 text-left rounded-xl shadow-md  bg-white flex-col items-center justify-center pt-12">
      <div className="mx-auto w-full  bg-white space-y-6">
        <h1 className="text-2xl font-semibold text-center">Create Product</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6 px-5 py-5">
            <FormInput control={control} className=" w-full" name="name" label="Product Name" type="text" />
            <FormInput
              description
              control={control}
              className=" w-full"
              name="description"
              label="Description"
              type="text"
            />
            {/**format currency */}
            <CategoriesField name={"category"} control={control} />
            <div className="flex items-center gap-2">
              <FormInput control={control} className="w-full" name="price" label="Price" type="number" />
              <FormInput control={control} className="w-full" name="stock" label="Stock" type="number" />
            </div>
            <Button className="flex items-center" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Next <ChevronRight />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProductStep1Form;
