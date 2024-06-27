import ProductStep1Form from "@/app/components/ProductStarterForm";
import React from "react";

const page = ({ product }: { product: any }) => {
  return <ProductStep1Form defaultValues={product} />;
};

export default page;
