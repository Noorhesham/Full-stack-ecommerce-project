import ProductStep1Form from "@/app/components/ProductStarterForm";
import Steps from "@/app/components/Steps";
import connect from "@/lib/database/connect";
import Product from "@/lib/database/models/ProductsModel";
import React from "react";

const page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const id = searchParams.id;
  await connect();
  let product=null;
  if(id) product = await Product.findById(id);
  return <ProductStep1Form defaultValues={product} />;
};

export default page;
