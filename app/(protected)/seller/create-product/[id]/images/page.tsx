"use client";
import AddImagesForm from "@/app/components/ImageForm";
import { useProduct } from "@/app/context/ProductContext";
import Product from "@/lib/database/models/ProductsModel";
import React from "react";

const Page =  () => {
  const { product } = useProduct();
  return <AddImagesForm product={product} />;
};

export default Page;
