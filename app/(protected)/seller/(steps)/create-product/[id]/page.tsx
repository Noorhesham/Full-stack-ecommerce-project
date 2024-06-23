import { getProduct } from "@/app/actions/products";
import ProductStep1Form from "@/app/components/ProductStarterForm";
import connect from "@/lib/database/connect";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  await connect();
  let product=null;
  if(id) product = await getProduct(id)
  return <ProductStep1Form defaultValues={product} />;
};

export default page;
