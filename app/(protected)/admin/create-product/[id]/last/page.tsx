import { getProduct, getVariants } from "@/app/actions/products";
import LastFormProduct from "@/app/components/LastFormProduct";
import connect from "@/lib/database/connect";
import React from "react";

const page = async () => {
  await connect();
  const variants = await getVariants();
  return <LastFormProduct  variations={variants} />;
};

export default page;
