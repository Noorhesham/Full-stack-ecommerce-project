import { getProduct } from "@/app/actions/products";
import ProductStep1Form from "@/app/components/ProductStarterForm";
import connect from "@/lib/database/connect";
import React from "react";

const page = async () => {

  return <ProductStep1Form />;
};

export default page;
