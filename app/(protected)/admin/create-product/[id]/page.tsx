"use client";
import ProductStep1Form from "@/app/components/ProductStarterForm";
import { useProduct } from "@/app/context/ProductContext";
import React from "react";

const Page = () => {
  const { product } = useProduct();
  return <ProductStep1Form product={product} />;
};

export default Page;
