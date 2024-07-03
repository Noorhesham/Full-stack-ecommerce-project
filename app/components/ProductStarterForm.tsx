"use client";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { CommandBox } from "./CommandBox";
import { motion } from "framer-motion";
import NextStep from "./NextStep";
import { toast } from "react-toastify";
import { useGetCategories } from "../queries/queries";
import Loader from "./Loader";
import { FancyMultiSelect } from "./MultiSelect";
import { ProductProps } from "../types";
import FormCard from "./FormCard";
import AddingButton from "./AddingButton";
import ModelCustom from "./ModelCustom";
import AddtionalInfoForm from "./AddtionalInfoForm";
import { BreadcrumbWithCustomSeparator } from "./BreacCumber";
const ProductStep1Form = ({ product }: { product?: ProductProps }) => {
  const { categories, isLoading: isGetting } = useGetCategories(); // getting all categoreis data
  const user: any = useSession().data?.user; // to pass it to the product creator
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof productStep1Schema>>({
    resolver: zodResolver(productStep1Schema),
    mode: "onChange",
    defaultValues: {
      name: (product && product?.name) || "",
      description: (product && product?.description) || "",
      category: (product && product?.category?._id) || "",
      price: (product && product?.price + "") || "$10.00",
      stock: (product && product?.stock + "") || "1",
      subCategories: product?.subCategories || [],
      additionalInfo: product?.additionalInfo || [],
      ribbon: "",
      isOnSale: product?.isOnSale || false,
      salePrice: (product && product?.salePrice) || "",
    },
  });
  const { handleSubmit, control, getValues, watch, setValue } = form;
  const additionalInfo = watch("additionalInfo");

  const { append, remove, fields } = useFieldArray({ control, name: "additionalInfo" });
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
  const [tempTitle, setTempTitle] = useState("");
  const [tempDescription, setTempDescription] = useState("");
  const handleAddInfo = () => {
    if (tempTitle && tempDescription) {
      append({ title: tempTitle, description: tempDescription });
      setTempTitle("");
      setTempDescription("");
    }
  };
  const SubCategoriesIndex = categories?.findIndex((cat: any, i: number) => cat._id === getValues("category"));
  return (
    <div className="container py-5">
      <div className="flex flex-col px-10  xl:pb-[1.6rem] relative rounded-2xl  items-center text-center">
        <div className="mx-auto w-full   space-y-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className=" ">
              <div className="flex items-center justify-between mb-5">
                <div className="flex flex-col items-center gap-2">
                  <BreadcrumbWithCustomSeparator />
                  <h1 className="text-2xl mr-auto font-semibold text-left">Create Product</h1>
                </div>
                <div className="flex items-center gap-3">
                  {!product && (
                    <Button
                      onClick={() => form.reset()}
                      variant={"destructive"}
                      type="reset"
                      className=" w-fit px-6 rounded-full relative "
                    >
                      Reset
                    </Button>
                  )}
                  {product ? (
                    <NextStep disabled={isLoading} url="/images" text="Update">
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    </NextStep>
                  ) : (
                    <Button type="submit" disabled={isLoading} className=" w-fit px-6 rounded-full relative ">
                      Next{" "}
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 flex flex-col gap-8">
                  <FormCard title="Product Details" subTitle="Fill in the details of your product.">
                    <div className="flex gap-4 items-center">
                      <FormInput control={control} className=" w-full" name="name" label="Product Name" type="text" />
                      <FormInput
                        control={control}
                        optional
                        className=" w-full"
                        name="ribbon"
                        label="Ribbon"
                        type="text"
                      />
                    </div>
                    <div className=" my-5">
                      <FormInput
                        description
                        control={control}
                        className=" mt-5 w-full"
                        name="description"
                        label="Description"
                        type="text"
                      />
                    </div>
                    <div className=" flex  flex-col gap-4">
                      <p className="text-sm text-muted-foreground leading-6">Addtional Info Section</p>
                      {fields.map((field, index) => (
                        <ModelCustom
                          text="Edit an Info section"
                          key={field.id}
                          value={field}
                          content={<AddtionalInfoForm index={index} control={control} remove={remove} />}
                          title="Add an Info section"
                          btn={
                            <div className="flex cursor-pointer hover:bg-rose-300 hover:text-gray-950 duration-150 w-full py-2 px-4  items-center gap-3">
                              <div>{additionalInfo && additionalInfo?.[index].title}</div>
                              <div>
                                {
                                  new DOMParser().parseFromString(
                                    (additionalInfo && additionalInfo?.[index].description) || "",
                                    "text/html"
                                  ).documentElement.textContent
                                }
                              </div>
                            </div>
                          }
                        />
                      ))}
                      <ModelCustom
                        title="Add an Info section"
                        text="Add an Info section"
                        btn={<AddingButton text="Add an Info section" />}
                        content={
                          <div className="flex flex-col gap-6 mt-3">
                            <FormInput
                              control={control}
                              className="w-full"
                              name="tempTitle"
                              label="Title"
                              type="text"
                              value={tempTitle}
                              onChange={(e: any) => setTempTitle(e.target.value)}
                            />
                            <FormInput
                              control={control}
                              className="w-full"
                              description
                              name="tempDescription"
                              label="Description"
                              type="text"
                              value={tempDescription}
                              onChange={(e: any) => setTempDescription(e.target ? e.target.value : e)}
                            />
                          </div>
                        }
                        onClick={handleAddInfo}
                      />
                    </div>
                  </FormCard>
                </div>
                <div className="flex flex-col gap-4">
                  <FormCard title="Category" subTitle="Select the category of your product.">
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
                  </FormCard>
                  <FormCard title="Pricing" subTitle="">
                    <div className="flex gap-4 items-center">
                      <FormInput price control={control} name="price" label="Price" type="text" />
                      {getValues("isOnSale") && (
                        <FormInput price control={control} name="salePrice" label="Sale Price" type="text" />
                      )}
                    </div>
                    <div className=" ml-auto">
                      <FormInput optional switchToggle control={control} name="isOnSale" label="Sale" />
                    </div>
                  </FormCard>
                  <FormCard title="Inventory and shipping" subTitle="">
                    <div className="flex items-center gap-2">
                      <FormInput control={control} className="w-full" name="stock" label="Stock" type="number" />
                    </div>
                  </FormCard>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductStep1Form;
